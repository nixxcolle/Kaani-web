-- Run after marketplace-update.sql. No payment is automatically charged or verified.
begin;
do $$ begin
  if not exists(select 1 from information_schema.columns where table_schema='public' and table_name='marketplace_orders' and column_name='payment_status') then
    alter table public.marketplace_orders add column payment_status text not null default 'Not Recorded' check(payment_status in ('Not Recorded','Unpaid','Paid'));
    alter table public.marketplace_orders alter column payment_status set default 'Unpaid';
  end if;
  if not exists(select 1 from information_schema.columns where table_schema='public' and table_name='marketplace_orders' and column_name='seller_seen_at') then
    alter table public.marketplace_orders add column seller_seen_at timestamptz;
    update public.marketplace_orders set seller_seen_at=now();
  end if;
end $$;
alter table public.marketplace_orders add column if not exists paid_at timestamptz;
alter table public.marketplace_orders add column if not exists payment_updated_at timestamptz;
create index if not exists marketplace_orders_unread_seller on public.marketplace_orders(seller_id) where seller_seen_at is null;
create index if not exists marketplace_orders_buyer on public.marketplace_orders(buyer_id);

create or replace function public.set_marketplace_order_payment(order_id uuid,next_payment_status text) returns void
language plpgsql security definer set search_path='' as $$
declare o public.marketplace_orders;
begin
  select * into o from public.marketplace_orders where id=order_id for update;
  if not found or o.seller_id is distinct from auth.uid() then raise exception 'Only the seller can record payment receipt.'; end if;
  if next_payment_status is null or next_payment_status not in ('Unpaid','Paid') or o.status='Cancelled' then raise exception 'Invalid payment update.'; end if;
  if o.payment_status=next_payment_status then return; end if;
  update public.marketplace_orders set payment_status=next_payment_status,payment_updated_at=now(),
    paid_at=case when next_payment_status='Paid' then now() else null end where id=order_id;
end $$;

create or replace function public.read_marketplace_orders(order_ids uuid[]) returns void
language sql security definer set search_path='' as $$
  update public.marketplace_orders set seller_seen_at=now()
  where seller_id=auth.uid() and id=any(order_ids) and seller_seen_at is null;
$$;
revoke all on function public.set_marketplace_order_payment(uuid,text),public.read_marketplace_orders(uuid[]) from public,anon;
grant execute on function public.set_marketplace_order_payment(uuid,text),public.read_marketplace_orders(uuid[]) to authenticated;

-- Both the order and stock change commit together; Realtime publishes only committed rows.
create or replace function public.place_marketplace_order(order_id uuid,product uuid,qty numeric,buyer text,phone text,expected_price numeric) returns uuid
language plpgsql security definer set search_path='' as $$
declare p public.marketplace_products; existing public.marketplace_orders;
begin
  if auth.uid() is null then raise exception 'Sign in to place an order.'; end if;
  select * into existing from public.marketplace_orders where id=order_id;
  if found then
    if existing.buyer_id=auth.uid() and existing.product_id=product and existing.quantity=qty and existing.buyer_name=trim(buyer) and existing.buyer_phone=trim(phone) and existing.unit_price=expected_price then return existing.id; end if;
    raise exception 'Order ID already used.';
  end if;
  if qty is null or qty<=0 or qty>1000000000 or qty<>round(qty,3) or buyer is null or length(trim(buyer)) not between 1 and 120 or phone is null or phone !~ '^\+?[0-9 ()-]{7,25}$' or length(regexp_replace(phone,'[^0-9]','','g'))<7 then raise exception 'Check the quantity, name and phone number.'; end if;
  select * into p from public.marketplace_products where id=product for update;
  if not found or p.owner_id=auth.uid() or p.review_status<>'Approved' or p.status<>'Available' or p.stock<qty or expected_price is distinct from p.price or round(p.price*qty,2)<=0 then raise exception 'Product unavailable, price changed or insufficient stock.'; end if;
  insert into public.marketplace_orders(id,buyer_id,seller_id,product_id,product_name,unit,buyer_name,buyer_phone,quantity,unit_price,total,payment_status)
  values(order_id,auth.uid(),p.owner_id,p.id,p.name,p.unit,trim(buyer),trim(phone),qty,p.price,round(p.price*qty,2),'Unpaid');
  update public.marketplace_products set stock=stock-qty,status=case when stock=qty then 'Out of Stock' else status end where id=p.id;
  return order_id;
end $$;
revoke all on function public.place_marketplace_order(uuid,uuid,numeric,text,text,numeric) from public,anon;
grant execute on function public.place_marketplace_order(uuid,uuid,numeric,text,text,numeric) to authenticated;

do $$ declare t text; begin
  if exists(select 1 from pg_publication where pubname='supabase_realtime') then
    foreach t in array array['marketplace_orders','marketplace_products','marketplace_commission_payments'] loop
      if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename=t) then execute format('alter publication supabase_realtime add table public.%I',t); end if;
    end loop;
  end if;
end $$;
commit;
