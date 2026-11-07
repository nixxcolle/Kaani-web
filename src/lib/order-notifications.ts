import { supabase } from './supabase';

export async function unreadSellerOrders(userId: string) {
  const { count,error } = await supabase.from('marketplace_orders').select('id',{count:'exact',head:true}).eq('seller_id',userId).is('seller_seen_at',null);
  if(error || count===null) throw new Error('Order notifications could not be loaded.');
  return count;
}

export async function readSellerOrders(ids: string[]) {
  if(!ids.length) return;
  const {error}=await supabase.rpc('read_marketplace_orders',{order_ids:ids});
  if(error) throw new Error('Order notifications could not be marked as read.');
  window.dispatchEvent(new Event('marketplace-orders-changed'));
}
