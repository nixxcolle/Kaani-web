import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { unreadSellerOrders } from '@/lib/order-notifications';
import { useToast } from '@/hooks/use-toast';

export function useOrderNotifications() {
  const [userId,setUserId]=useState<string|null>(null);
  const [unread,setUnread]=useState(0);
  const {toast}=useToast();
  useEffect(()=>{
    let active=true,authEvent=false;
    void supabase.auth.getUser().then(({data})=>{if(active && !authEvent) setUserId(data.user?.id || null);}).catch(()=>{if(active && !authEvent) setUserId(null);});
    const {data}=supabase.auth.onAuthStateChange((_event,session)=>{authEvent=true;if(active) setUserId(session?.user.id || null);});
    return ()=>{active=false;data.subscription.unsubscribe();};
  },[]);
  useEffect(()=>{
    setUnread(0);if(!userId) return;
    let active=true,version=0;const announced=new Set<string>();
    const refresh=async()=>{if(!active) return;const current=++version;try{const count=await unreadSellerOrders(userId);if(active && current===version) setUnread(count);}catch{/* The dashboard shows connection errors; notification failure must not block navigation. */}};
    const changed=()=>{void refresh();};
    const channel=supabase.channel(`seller-order-notifications-${userId}`)
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'marketplace_orders',filter:`seller_id=eq.${userId}`},payload=>{
        if(!active || payload.new.seller_id!==userId) return;
        if(!announced.has(payload.new.id)) { announced.add(payload.new.id);if(announced.size>200) announced.delete(announced.values().next().value);toast({title:'New customer order',description:'Open Seller Orders to view the order and confirm fulfillment.'}); }
        window.dispatchEvent(new Event('marketplace-orders-changed'));
      })
      .on('postgres_changes',{event:'UPDATE',schema:'public',table:'marketplace_orders',filter:`seller_id=eq.${userId}`},changed)
      .subscribe(status=>{if(status==='SUBSCRIBED') void refresh();});
    void refresh();const timer=window.setInterval(changed,20000);
    window.addEventListener('focus',changed);window.addEventListener('marketplace-orders-changed',changed);
    return ()=>{active=false;version++;clearInterval(timer);void supabase.removeChannel(channel);window.removeEventListener('focus',changed);window.removeEventListener('marketplace-orders-changed',changed);};
  },[userId,toast]);
  return unread;
}
