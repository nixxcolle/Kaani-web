import { supabase } from './supabase';
import { validatePhoto } from './products';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
export type Order = { billing_key?: string; billing_start?: string; billing_end?: string; id: string; seller_id: string; buyer_id: string; buyer_name: string; buyer_phone: string; product_id?: string; product_name: string; quantity: number; unit: string; total: number; status: OrderStatus; created_at: string; completed_at: string | null; commission_rate: number | null; commission: number | null; due_date: string | null };
export type Payment = { billing_key?: string; period_start?: string; period_end?: string; id: string; month: string; amount: number; reference: string; payment_date: string; status: 'Pending Verification' | 'Paid' | 'Rejected'; receipt_path: string | null };
export type Listing = { id: string; name: string; created_at: string; review_status: string; stock: number; unit: string; photo_url: string };
export type Dashboard = { listings?: Listing[]; user_id: string; profile: { name?: string; email: string }; products: number; orders: Order[]; payments: Payment[] };

export function monthlyCommissions(orders: Order[], payments: Payment[], sellerId: string) {
  const months = new Map<string, { month: string; sales: number; commission: number; paid: number; pending: number; balance: number; due: string; orders: Order[] }>();
  for (const order of orders) {
    if (order.seller_id !== sellerId || order.status !== 'Completed' || !order.completed_at) continue;
    // Use date parts because locale date ordering differs between browsers.
    const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit' }).formatToParts(new Date(order.completed_at));
    const key = `${parts.find(p => p.type === 'year')!.value}-${parts.find(p => p.type === 'month')!.value}-01`;
    const row = months.get(key) || { month: key, sales: 0, commission: 0, paid: 0, pending: 0, balance: 0, due: order.due_date || '', orders: [] };
    row.sales += Math.round(Number(order.total) * 100); row.commission += Math.round(Number(order.commission) * 100); row.orders.push(order);
    if (order.due_date && order.due_date < row.due) row.due = order.due_date;
    months.set(key, row);
  }
  for (const payment of payments) {
    const row = months.get(payment.month); if (!row) continue;
    if (payment.status === 'Paid') row.paid += Math.round(Number(payment.amount) * 100);
    if (payment.status === 'Pending Verification') row.pending += Math.round(Number(payment.amount) * 100);
  }
  return [...months.values()].sort((a,b) => b.month.localeCompare(a.month)).map(row => ({ ...row, sales: row.sales / 100, commission: row.commission / 100, paid: row.paid / 100, pending: row.pending / 100, balance: Math.max(0, row.commission - row.paid) / 100 }));
}

export async function fetchDashboard(): Promise<Dashboard> {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError && authError.name !== 'AuthSessionMissingError') throw new Error('Dashboard could not be loaded. Check your connection and seller-dashboard database setup.');
  if (authError || !auth.user) throw new Error('Sign in to open your dashboard.');
  const { data, error } = await supabase.rpc('marketplace_dashboard');
  if (error) throw new Error('Dashboard could not be loaded. Check your connection and seller-dashboard database setup.');
  if (!data) throw new Error('Sign in to open your dashboard.');
  // Read posting dates directly when an older dashboard RPC response lacks listing details.
  if (!data.listings?.length && data.products>0) {
    const listings: Listing[] = []; let total = 0;
    do {
      const { data: rows, error: listingError, count } = await supabase.from('marketplace_products').select('id,name,created_at,review_status,stock,unit,photo_url', { count: 'exact' }).eq('owner_id',auth.user.id).order('created_at').order('id').range(listings.length,listings.length+99);
      if (listingError || !rows || count === null || (!rows.length && listings.length<count)) throw new Error('Your products could not be loaded. Check the product review database setup.');
      listings.push(...rows); total=count;
    } while(listings.length<total);
    data.listings=listings;data.products=listings.length;
  }
  return data;
}
export async function placeOrder(id: string, productId: string, quantity: number, name: string, phone: string, expectedPrice: number) {
  if (!Number.isFinite(quantity) || quantity <= 0 || Math.abs(quantity * 1000 - Math.round(quantity * 1000)) > 0.00001 || !name.trim() || !/^\+?[\d ()-]{7,25}$/.test(phone)) throw new Error('Check the quantity, name and phone number.');
  const { error } = await supabase.rpc('place_marketplace_order', { order_id: id, product: productId, qty: quantity, buyer: name.trim(), phone: phone.trim(), expected_price: expectedPrice });
  if (error) throw new Error('Order could not be placed. Sign in, check stock and your details, then retry.');
}
export async function updateOrder(id: string, status: OrderStatus) {
  const { error } = await supabase.rpc('set_marketplace_order_status', { order_id: id, next_status: status });
  if (error) throw new Error('Order could not be updated. Refresh and check the commission configuration or order status.');
}
export async function submitPayment(id: string, month: string, amount: number, reference: string, date: string, photo: File | null) {
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000_000 || Math.abs(amount * 100 - Math.round(amount * 100)) > 0.00001 || !/^\d{10,20}$/.test(reference) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !(/^\d{4}-\d{2}-01$/.test(month) || /^[a-f0-9-]{36}:\d+$/.test(month))) throw new Error('Check the payment amount, date and GCash reference.');
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error('Sign in to open your dashboard.');
  let receipt: string | null = null;
  if (photo) {
    validatePhoto(photo);
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', await photo.arrayBuffer()))].map(byte=>byte.toString(16).padStart(2,'0')).join('');
    receipt = `${user.id}/${id}-${hash}.${photo.type === 'image/png' ? 'png' : photo.type === 'image/webp' ? 'webp' : 'jpg'}`;
    const { error } = await supabase.storage.from('commission-receipts').upload(receipt, photo, { upsert: false, contentType: photo.type });
    if (error && error.message !== 'The resource already exists') throw new Error('Receipt upload failed. Please try again.');
  }
  const cycle = month.includes(':');
  const { error } = await supabase.rpc(cycle ? 'submit_product_cycle_payment' : 'submit_commission_payment', { payment_id: id, ...(cycle ? { billing_key: month } : { billing_month: month }), paid: amount, reference_number: reference, paid_on: date, receipt });
  if (error) throw new Error('Payment submission failed. Refresh payment history before retrying; check the reference and billing month.');
}
export async function receiptUrl(path: string) {
  const { data, error } = await supabase.storage.from('commission-receipts').createSignedUrl(path, 60);
  if (error) throw new Error('Receipt could not be opened.');
  return data.signedUrl;
}

export function productCommissionSummary(orders: Order[]) {
  const products = new Map<string, { name: string; sales: number; commission: number; quantity: number }>();
  for (const order of orders) {
    if (order.status !== 'Completed') continue;
    const key = order.product_id || order.product_name;
    const row = products.get(key) || { name: order.product_name, sales: 0, commission: 0, quantity: 0 };
    row.sales += Math.round(Number(order.total)*100); row.commission += Math.round(Number(order.commission)*100); row.quantity += Number(order.quantity); products.set(key,row);
  }
  return [...products.values()].map(p=>({...p,sales:p.sales/100,commission:p.commission/100}));
}

export function commissionCsv(orders: Order[]) {
  const rows = productCommissionSummary(orders);
  const cell = (value: string | number) => '"' + String(value).replace(/^[\s]*[=+@-]/, "'$&").replace(/"/g,'""') + '"';
  return '\ufeff' + [['Product','Quantity','Completed Sales (PHP)','Commission (PHP)'],...rows.map(p=>[p.name,p.quantity,p.sales.toFixed(2),p.commission.toFixed(2)]),['TOTAL','',rows.reduce((s,p)=>s+Math.round(p.sales*100),0)/100,rows.reduce((s,p)=>s+Math.round(p.commission*100),0)/100]].map(row=>row.map(cell).join(',')).join('\r\n');
}

export function closedBillingMonth(month: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit' }).formatToParts(now);
  return month < `${parts.find(p=>p.type==='year')!.value}-${parts.find(p=>p.type==='month')!.value}-01`;
}

const BILLING_MS = 30 * 24 * 60 * 60 * 1000;
export function productBillingPeriod(postedAt: string, now = new Date()) {
  const posted = new Date(postedAt).getTime();
  if (!Number.isFinite(posted)) throw new Error('Invalid product posting date.');
  const index = Math.max(0, Math.floor((now.getTime()-posted)/BILLING_MS));
  const start = posted + index*BILLING_MS;
  return { index, start: new Date(start).toISOString(), end: new Date(start+BILLING_MS).toISOString(), daysLeft: Math.max(0,Math.ceil((start+BILLING_MS-now.getTime())/86400000)), progress: Math.max(0,Math.min(100,(now.getTime()-start)/BILLING_MS*100)) };
}

export function billingStatements(orders: Order[], payments: Payment[], sellerId: string) {
  const legacy = monthlyCommissions(orders.filter(o=>!o.billing_key),payments.filter(p=>!p.billing_key),sellerId).map(m=>({...m,label:m.month.slice(0,7),start:'',end:''}));
  const periods = new Map<string, (typeof legacy)[number]>();
  for (const order of orders) {
    if (order.seller_id!==sellerId || order.status!=='Completed' || !order.billing_key || !order.billing_start || !order.billing_end) continue;
    const row = periods.get(order.billing_key) || { month: order.billing_key, label: order.product_name, start: order.billing_start, end: order.billing_end, sales: 0,commission:0,paid:0,pending:0,balance:0,due:order.billing_end,orders:[] };
    row.sales+=Math.round(Number(order.total)*100);row.commission+=Math.round(Number(order.commission)*100);row.orders.push(order);periods.set(order.billing_key,row);
  }
  for (const payment of payments) {
    const row=periods.get(payment.billing_key);if(!row) continue;
    if(payment.status==='Paid') row.paid+=Math.round(Number(payment.amount)*100);
    if(payment.status==='Pending Verification') row.pending+=Math.round(Number(payment.amount)*100);
  }
  return [...[...periods.values()].map(p=>({...p,sales:p.sales/100,commission:p.commission/100,paid:p.paid/100,pending:p.pending/100,balance:Math.max(0,p.commission-p.paid)/100})),...legacy].sort((a,b)=>(b.end || b.month).localeCompare(a.end || a.month));
}

export function closedBillingStatement(statement: { month: string; end: string }, now = new Date()) {
  return statement.end ? new Date(statement.end).getTime()<=now.getTime() : closedBillingMonth(statement.month,now);
}
