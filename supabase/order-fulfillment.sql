-- Run after marketplace-update.sql. Preserves previously completed orders and payments.
begin;
alter table public.marketplace_orders drop constraint if exists marketplace_orders_status_check;
alter table public.marketplace_orders add constraint marketplace_orders_status_check check(status in ('Pending','Confirmed','Delivered','Completed','Cancelled'));
alter table public.marketplace_orders add column if not exists confirmed_at timestamptz;
alter table public.marketplace_orders add column if not exists handed_over_at timestamptz;
alter table public.marketplace_orders add column if not exists received_at timestamptz;
alter table public.marketplace_orders add column if not exists not_received_at timestamptz;
alter table public.marketplace_orders add column if not exists receipt_status text check(receipt_status in ('Received','Not Received'));

create or replace function public.set_marketplace_order_status(order_id uuid,next_status text) returns void
language plpgsql security definer set search_path='' as $$
declare o public.marketplace_orders;
begin
  select * into o from public.marketplace_orders where id=order_id for update;
  if not found or o.seller_id is distinct from auth.uid() then raise exception 'Only the seller can update fulfillment.'; end if;
  if next_status is null or next_status not in ('Confirmed','Delivered','Cancelled') then raise exception 'Customer receipt confirmation is required to complete an order.'; end if;
  if o.status=next_status then return; end if;
  if not ((o.status='Pending' and next_status in ('Confirmed','Cancelled')) or (o.status='Confirmed' and next_status in ('Delivered','Cancelled'))) then raise exception 'Invalid order status change.'; end if;
  update public.marketplace_orders set status=next_status,
    confirmed_at=case when next_status='Confirmed' then now() else confirmed_at end,
    handed_over_at=case when next_status='Delivered' then now() else handed_over_at end
  where id=order_id;
  if next_status='Cancelled' then
    update public.marketplace_products set stock=stock+o.quantity,status=case when status='Out of Stock' then 'Available' else status end where id=o.product_id;
  end if;
end $$;

create or replace function public.confirm_marketplace_order_receipt(order_id uuid,received boolean) returns void
language plpgsql security definer set search_path='' as $$
declare o public.marketplace_orders; s public.marketplace_commission_settings;
begin
  select * into o from public.marketplace_orders where id=order_id for update;
  if not found or o.buyer_id is distinct from auth.uid() then raise exception 'Only the buyer can confirm receipt.'; end if;
  if received is null then raise exception 'Choose received or not received.'; end if;
  if received and o.status='Completed' and o.receipt_status='Received' then return; end if;
  if o.status<>'Delivered' then raise exception 'The seller must confirm handover or delivery first.'; end if;
  if not received then
    update public.marketplace_orders set receipt_status='Not Received',not_received_at=coalesce(not_received_at,now()) where id=order_id;
    return;
  end if;
  select * into s from public.marketplace_commission_settings where id;
  if s.rate is null then raise exception 'Commission rate must be configured first.'; end if;
  update public.marketplace_orders set status='Completed',receipt_status='Received',received_at=now(),completed_at=now(),
    commission_rate=s.rate,commission=round(total*s.rate,2),due_date=(date_trunc('month',now() at time zone 'Asia/Manila')+interval '1 month - 1 day')::date
  where id=order_id;
  -- The existing billing trigger assigns the original product's 30-day period.
end $$;
revoke all on function public.set_marketplace_order_status(uuid,text),public.confirm_marketplace_order_receipt(uuid,boolean) from public,anon;
grant execute on function public.set_marketplace_order_status(uuid,text),public.confirm_marketplace_order_receipt(uuid,boolean) to authenticated;
do $$ begin
  assert not has_table_privilege('authenticated','public.marketplace_orders','UPDATE'), 'Order changes must use the checked functions';
  assert not has_function_privilege('anon','public.confirm_marketplace_order_receipt(uuid,boolean)','EXECUTE'), 'Guests cannot confirm receipts';
end $$;
commit;
