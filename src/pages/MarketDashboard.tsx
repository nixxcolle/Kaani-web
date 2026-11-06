import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useText } from '@/lib/translate';
import { formatPeso } from '@/lib/commission';
import { supabase } from '@/lib/supabase';
import { fetchDashboard, monthlyCommissions, productCommissionSummary, commissionCsv, closedBillingMonth, receiptUrl, submitPayment, updateOrder, type Dashboard, type OrderStatus } from '@/lib/seller-dashboard';

const sections = ['Dashboard Overview', 'My Orders', 'My Sales', 'My Commission', 'Submit GCash Payment', 'Payment History'];
const control = 'w-full rounded-xl border border-emerald-200 bg-white p-3 text-slate-900';
const panel = 'rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm';

export default function MarketDashboard() {
  const tx = useText(); const { toast } = useToast();
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState(''); const [notice, setNotice] = useState('');
  const [section, setSection] = useState(sections[0]); const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(''); const [amount, setAmount] = useState(''); const [reference, setReference] = useState(''); const [date, setDate] = useState(''); const [photo, setPhoto] = useState<File | null>(null);
  const [receipt, setReceipt] = useState(''); const lock = useRef(false); const request = useRef(0); const paymentId = useRef(crypto.randomUUID());
  const refresh = useCallback(async () => {
    const current = ++request.current;
    try { const next = await fetchDashboard(); if (request.current === current) { setData(next); setError(''); } }
    catch (e) { if (request.current === current) setError(e instanceof Error ? e.message : 'Dashboard could not be loaded.'); }
    finally { if (request.current === current) setLoading(false); }
  }, []);
  useEffect(() => {
    void refresh();
    const focus = () => { if (!document.hidden) void refresh(); };
    const auth = () => { setData(null); setSection(sections[0]); setReceipt(''); void refresh(); };
    const timer = window.setInterval(focus, 30000);
    const channel = supabase.channel('my-market-dashboard').on('postgres_changes', { event: '*', schema: 'public', table: 'marketplace_orders' }, focus).on('postgres_changes', { event: '*', schema: 'public', table: 'marketplace_commission_payments' }, focus).subscribe();
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      setData(null); setReceipt(''); setSection(sections[0]);
      window.setTimeout(() => void refresh(), 0);
    });
    window.addEventListener('focus', focus); window.addEventListener('auth-change', auth);
    const invalidate = () => { request.current++; };
    return () => { invalidate(); clearInterval(timer); void supabase.removeChannel(channel); authListener.subscription.unsubscribe(); window.removeEventListener('focus', focus); window.removeEventListener('auth-change', auth); };
  }, [refresh]);
  const sellerOrders = data?.orders.filter(o => o.seller_id === data.user_id) || [];
  const seller = !!data && (data.products > 0 || sellerOrders.length > 0);
  const months = data ? monthlyCommissions(sellerOrders, data.payments, data.user_id) : [];
  const billingMonths = months.filter(m => closedBillingMonth(m.month));
  const downloadReport = (month: string, orders: Parameters<typeof commissionCsv>[0]) => { const url = URL.createObjectURL(new Blob([commissionCsv(orders)], { type: 'text/csv;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = `kaani-commission-${month.slice(0,7)}.csv`; a.click(); window.setTimeout(()=>URL.revokeObjectURL(url),1000); };
  const visibleSection = !seller && !sections.slice(0,2).includes(section) ? sections[0] : section;
  const run = async (action: () => Promise<void>, message: string) => {
    if (lock.current) return; lock.current = true; setBusy(true); setError(''); setNotice('');
    try { await action(); setNotice(message); toast({ title: message }); await refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Please try again.'); }
    finally { lock.current = false; setBusy(false); }
  };
  const orders = visibleSection === 'My Sales' ? sellerOrders.filter(o => o.status === 'Completed') : seller ? sellerOrders : data?.orders || [];
  return <><Header /><main className="container mx-auto max-w-6xl px-4 py-8 sm:py-12 min-h-[70vh]">
    <div className="flex flex-wrap gap-4 justify-between items-start mb-7"><div><p className="text-emerald-700 font-semibold">{tx('Kaani Market')}</p><h1 className="text-3xl font-bold text-emerald-950">{tx('My Dashboard')}</h1></div><Button asChild variant="outline"><Link to="/market">{tx('My Products')}</Link></Button><Button disabled={busy} variant="outline" onClick={() => void refresh()}>{tx('Refresh')}</Button></div>
    {loading && <p role="status">{tx('Loading page...')}</p>}
    {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{tx(error)} {!data && <Link className="underline" to="/auth">{tx('Sign In')}</Link>}</div>}
    {notice && <p role="status" className="mb-5 rounded-xl bg-emerald-50 p-4 text-emerald-900">{tx(notice)}</p>}
    {data && <><nav aria-label={tx('My Dashboard')} className="flex flex-wrap gap-2 mb-7">{sections.filter((_,i) => seller || i<2).map(name => <Button key={name} variant={visibleSection===name ? 'default' : 'outline'} onClick={() => { setSection(name); setNotice(''); }} aria-current={visibleSection===name ? 'page' : undefined}>{tx(name)}</Button>)}</nav>
    {visibleSection===sections[0] && <div className="space-y-6"><section className={panel}><h2 className="text-2xl font-bold text-emerald-950">{tx('Welcome')}, {data.profile.name || data.profile.email}</h2><p className="break-all text-slate-600 mt-2">{data.profile.email}</p></section><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[[tx('Listed Products'),data.products],[tx('Orders'),seller ? sellerOrders.length : data.orders.length],...(seller ? [[tx('Completed Sales'),formatPeso(months.reduce((sum,m)=>sum+m.sales,0))],[tx('Outstanding Commission'),formatPeso(months.reduce((sum,m)=>sum+m.balance,0))]] : [])].map(([label,value])=><div className={panel} key={label}><p className="text-sm text-slate-600">{label}</p><p className="text-2xl font-bold text-emerald-900 mt-2">{value}</p></div>)}</div></div>}
    {(visibleSection===sections[1] || visibleSection===sections[2]) && <section className="space-y-4"><h2 className="text-xl font-bold">{tx(visibleSection)}</h2>{visibleSection===sections[2] && <p>{tx('Total Sales')}: {formatPeso(months.reduce((sum,m)=>sum+m.sales,0))}</p>}{!orders.length && <p className={panel}>{tx('No records yet.')}</p>}{orders.map(o=><article key={o.id} className={panel}><div className="flex flex-wrap justify-between gap-3"><h3 className="font-bold text-lg">{tx(o.product_name)}</h3><strong>{formatPeso(Number(o.total))}</strong></div><dl className="grid gap-3 sm:grid-cols-2 mt-3 text-sm"><div><dt>{tx('Order ID')}</dt><dd className="break-all">{o.id}</dd></div><div><dt>{tx('Buyer')}</dt><dd>{o.buyer_name} · {o.buyer_phone}</dd></div><div><dt>{tx('Quantity')}</dt><dd>{o.quantity} {tx(o.unit)}</dd></div><div><dt>{tx(visibleSection===sections[2] ? 'Transaction Date' : 'Order Date')}</dt><dd>{new Date(o.completed_at || o.created_at).toLocaleString()}</dd></div></dl><div className="flex flex-wrap gap-3 items-center mt-4"><span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold">{tx(o.status)}</span>{visibleSection===sections[1] && o.seller_id===data.user_id && ['Pending','Confirmed'].includes(o.status) && <>{(o.status==='Pending' ? ['Confirmed','Cancelled'] : ['Completed','Cancelled']).map(status=><Button key={status} variant="outline" disabled={busy} onClick={()=>{ if(window.confirm(tx('Update this order status?')+' '+tx(status))) void run(()=>updateOrder(o.id,status as OrderStatus),'Order updated.'); }}>{tx(status)}</Button>)}</>}</div></article>)}</section>}
    {visibleSection===sections[3] && <section className="space-y-5"><h2 className="text-xl font-bold">{tx('My Commission')}</h2><p>{tx('Payment deadline: not yet specified by Kaani.')}</p><p>{tx('Only completed sales count. Pending payments do not reduce the balance until verified.')}</p>{!months.length && <p className={panel}>{tx('No records yet.')}</p>}{months.map(m=><article className={panel} key={m.month}><h3 className="font-bold text-xl">{m.month.slice(0,7)}</h3><div className="grid gap-3 sm:grid-cols-2 mt-4"><p>{tx('Total Sales')}: {formatPeso(m.sales)}</p><p>{tx('Commission Owed')}: {formatPeso(m.commission)}</p><p>{tx('Outstanding Commission')}: {formatPeso(m.balance)}</p><p>{tx('Month-end Statement Date')}: {m.due}</p><p>{tx('Status')}: {tx(m.balance===0 ? 'Paid' : m.pending>0 ? 'Pending Verification' : 'Unpaid')}</p><p>{tx('Verified Payments')}: {formatPeso(m.paid)}</p><p>{tx('Pending Verification')}: {formatPeso(m.pending)}</p></div><p className="mt-4 text-sm">{tx(closedBillingMonth(m.month) ? 'Final monthly summary' : 'Current month: accruing until month end')}</p><Button className="mt-3" variant="outline" onClick={()=>downloadReport(m.month,m.orders)}>{tx('Download Monthly Report')}</Button><div className="mt-4 space-y-2">{productCommissionSummary(m.orders).map((p,i)=><p key={i} className="border-t pt-2">{tx(p.name)} · {tx('Total Sales')}: {formatPeso(p.sales)} · {tx('Commission')}: {formatPeso(p.commission)}</p>)}</div><ul className="mt-4 space-y-3">{m.orders.map(o=><li key={o.id} className="border-t pt-3 text-sm break-words">{tx(o.product_name)} · {o.id} · {tx('Commission Rate')}: {Number(o.commission_rate)*100}% · {formatPeso(Number(o.commission))}</li>)}</ul></article>)}</section>}
    {visibleSection===sections[4] && <section className={`${panel} max-w-2xl`}><h2 className="text-xl font-bold">{tx('Submit GCash Payment')}</h2><p className="mt-3">{tx('Send your commission payment through GCash to the official Kaani number:')}</p><p className="text-2xl text-emerald-800 font-bold my-3">09305846861</p><p className="mb-5 text-slate-600">{tx('Check the recipient in GCash before sending. Submit the exact reference below. Kaani will manually verify your payment; submitting this form does not transfer money.')}</p><p className="mb-4">{tx('Commission is summarized at month end. Submit payment only for closed months.')}</p><form onSubmit={e=>{e.preventDefault();void run(async()=>{await submitPayment(paymentId.current,month,Number(amount),reference,date,photo);paymentId.current=crypto.randomUUID();setAmount('');setReference('');setDate('');setPhoto(null);setSection('Payment History');},'Payment submitted. Pending Verification.');}}><fieldset disabled={busy} className="space-y-4"><label className="block">{tx('Billing Month')}<select required value={month} onChange={e=>setMonth(e.target.value)} className={control}><option value="">{tx('Select Month')}</option>{billingMonths.map(m=><option key={m.month} value={m.month}>{m.month.slice(0,7)} · {formatPeso(m.balance)}</option>)}</select></label><label className="block">{tx('Amount Paid')}<input className={control} type="number" required min="0.01" max="1000000000" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)}/></label><label className="block">{tx('GCash Reference Number')}<input className={control} required inputMode="numeric" pattern="[0-9]{10,20}" maxLength={20} value={reference} onChange={e=>setReference(e.target.value)}/></label><label className="block">{tx('Payment Date')}<input className={control} required type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><label className="block">{tx('Receipt Screenshot (optional)')}<input className={control} type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setPhoto(e.target.files?.[0] || null)}/></label><Button type="submit" disabled={!billingMonths.length || busy}>{tx(busy ? 'Saving...' : 'Submit Payment')}</Button></fieldset></form></section>}
    {visibleSection===sections[5] && <section className="space-y-4"><h2 className="text-xl font-bold">{tx('Payment History')}</h2>{!data.payments.length && <p className={panel}>{tx('No records yet.')}</p>}{data.payments.map(p=><article className={panel} key={p.id}><p className="font-bold">{p.month.slice(0,7)} · {formatPeso(Number(p.amount))} · {tx(p.status)}</p><p className="mt-2 break-all">{tx('GCash Reference Number')}: {p.reference}</p><p>{tx('Payment Date')}: {p.payment_date}</p>{p.receipt_path && <Button variant="outline" className="mt-3" onClick={()=>void run(async()=>setReceipt(await receiptUrl(p.receipt_path!)),'Receipt ready.')}>{tx('View Receipt')}</Button>}</article>)}{receipt && <a href={receipt} target="_blank" rel="noreferrer" className="underline text-emerald-800">{tx('Open Receipt (expires in 60 seconds)')}</a>}</section>}
    </>}
  </main><Footer /></>;
}
