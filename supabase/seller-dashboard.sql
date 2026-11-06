-- Run once after marketplace.sql. Transactional: any error rolls back this setup.
begin;
create table if not exists public.marketplace_commission_settings (
  id boolean primary key default true check(id), rate numeric check(rate between 0 and 1),
  description text not null default '5% of completed sales, summarized at month end'
);
insert into public.marketplace_commission_settings(id,rate) values(true,0.05) on conflict do nothing;
alter table public.marketplace_commission_settings enable row level security;
revoke all on public.marketplace_commission_settings from anon,authenticated;
grant select on public.marketplace_commission_settings to authenticated;
create policy commission_settings_read on public.marketplace_commission_settings for select to authenticated using(true);

create table public.marketplace_orders (
  id uuid primary key, buyer_id uuid not null references auth.users(id), seller_id uuid not null references auth.users(id),
  product_id uuid references public.marketplace_products(id) on delete set null,
  product_name text not null, unit text not null, buyer_name text not null, buyer_phone text not null,
  quantity numeric(13,3) not null check(quantity > 0), unit_price numeric(12,2) not null check(unit_price > 0),
  total numeric not null, status text not null default 'Pending' check(status in ('Pending','Confirmed','Completed','Cancelled')),
  commission_rate numeric check(commission_rate between 0 and 1), commission numeric,
  created_at timestamptz not null default now(), completed_at timestamptz, due_date date,
  check(buyer_id <> seller_id)
);
create index on public.marketplace_orders(seller_id,completed_at);
alter table public.marketplace_orders enable row level security;
revoke all on public.marketplace_orders from anon,authenticated;
grant select on public.marketplace_orders to authenticated;
create policy own_orders on public.marketplace_orders for select to authenticated using(auth.uid() in (buyer_id,seller_id));

create table public.marketplace_commission_payments (
  id uuid primary key, seller_id uuid not null references auth.users(id), month date not null check(extract(day from month)=1),
  amount numeric(12,2) not null check(amount > 0), reference text not null unique check(reference ~ '^[0-9]{10,20}$'),
  payment_date date not null, receipt_path text,
  status text not null default 'Pending Verification' check(status in ('Pending Verification','Paid','Rejected')),
  created_at timestamptz not null default now(), verified_at timestamptz, verified_by text,
  check(receipt_path is null or receipt_path like seller_id::text || '/%')
);
alter table public.marketplace_commission_payments enable row level security;
revoke all on public.marketplace_commission_payments from anon,authenticated;
grant select on public.marketplace_commission_payments to authenticated;
create policy own_commission_payments on public.marketplace_commission_payments for select to authenticated using(auth.uid()=seller_id);

create function public.place_marketplace_order(order_id uuid, product uuid, qty numeric, buyer text, phone text, expected_price numeric) returns uuid
language plpgsql security definer set search_path='' as $$
declare p public.marketplace_products; existing public.marketplace_orders;
begin
  if auth.uid() is null then raise exception 'Sign in to place an order.'; end if;
  select * into existing from public.marketplace_orders where id=order_id;
  if found then
    if existing.buyer_id=auth.uid() and existing.product_id=product and existing.quantity=qty and existing.buyer_name=trim(buyer) and existing.buyer_phone=trim(phone) then return existing.id; end if;
    raise exception 'Order ID already used.';
  end if;
  if qty is null or qty<=0 or qty>1000000000 or qty<>round(qty,3) or length(trim(buyer)) not between 1 and 120 or buyer is null or phone is null or phone !~ '^\+?[0-9 ()-]{7,25}$' then raise exception 'Check the quantity, name and phone number.'; end if;
  select * into p from public.marketplace_products where id=product for update;
  if not found or p.owner_id=auth.uid() or p.status<>'Available' or p.stock<qty or expected_price is distinct from p.price or round(p.price*qty,2)<=0 then raise exception 'Product unavailable, price changed or insufficient stock.'; end if;
  insert into public.marketplace_orders(id,buyer_id,seller_id,product_id,product_name,unit,buyer_name,buyer_phone,quantity,unit_price,total)
  values(order_id,auth.uid(),p.owner_id,p.id,p.name,p.unit,trim(buyer),trim(phone),qty,p.price,round(p.price*qty,2));
  update public.marketplace_products set stock=stock-qty,status=case when stock=qty then 'Out of Stock' else status end where id=p.id;
  return order_id;
end $$;

create function public.set_marketplace_order_status(order_id uuid, next_status text) returns void
language plpgsql security definer set search_path='' as $$
declare o public.marketplace_orders; s public.marketplace_commission_settings;
begin
  select * into o from public.marketplace_orders where id=order_id for update;
  if not found or o.seller_id is distinct from auth.uid() then raise exception 'Only the seller can update this order.'; end if;
  if o.status=next_status then return; end if;
  if not ((o.status='Pending' and next_status in ('Confirmed','Cancelled')) or (o.status='Confirmed' and next_status in ('Completed','Cancelled'))) then raise exception 'Invalid order status change.'; end if;
  if next_status='Completed' then
    select * into s from public.marketplace_commission_settings where id;
    if s.rate is null then raise exception 'Commission rate must be configured by Kaani first.'; end if;
    update public.marketplace_orders set status=next_status,completed_at=now(),commission_rate=s.rate,commission=round(total*s.rate,2),
      due_date=(date_trunc('month',now() at time zone 'Asia/Manila')+interval '1 month - 1 day')::date where id=order_id;
  else
    update public.marketplace_orders set status=next_status where id=order_id;
    if next_status='Cancelled' then
      update public.marketplace_products set stock=stock+o.quantity,status=case when status='Out of Stock' then 'Available' else status end where id=o.product_id;
    end if;
  end if;
end $$;

create function public.submit_commission_payment(payment_id uuid, billing_month date, paid numeric, reference_number text, paid_on date, receipt text default null) returns uuid
language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is null or not exists(select 1 from public.marketplace_orders where seller_id=auth.uid() and status='Completed') then raise exception 'No completed seller sales.'; end if;
  if exists(select 1 from public.marketplace_commission_payments where id=payment_id and seller_id=auth.uid() and month=billing_month and amount=paid and reference=reference_number and payment_date=paid_on and receipt_path is not distinct from receipt) then return payment_id; end if;
  if billing_month is null or extract(day from billing_month)<>1 or paid is null or paid<=0 or paid>1000000000 or paid<>round(paid,2) or paid_on is null or paid_on>(now() at time zone 'Asia/Manila')::date or reference_number is null or reference_number !~ '^[0-9]{10,20}$' then raise exception 'Check the payment amount, date and GCash reference.'; end if;
  if billing_month>=date_trunc('month',now() at time zone 'Asia/Manila')::date then raise exception 'Submit commission payments after the billing month ends.'; end if;
  if not exists(select 1 from public.marketplace_orders where seller_id=auth.uid() and status='Completed' and date_trunc('month',completed_at at time zone 'Asia/Manila')::date=billing_month) then raise exception 'No completed sales for that month.'; end if;
  if receipt is not null and (receipt not like auth.uid()::text || '/%' or not exists(select 1 from storage.objects where bucket_id='commission-receipts' and name=receipt)) then raise exception 'Invalid receipt.'; end if;
  insert into public.marketplace_commission_payments(id,seller_id,month,amount,reference,payment_date,receipt_path)
  values(payment_id,auth.uid(),billing_month,paid,reference_number,paid_on,receipt);
  return payment_id;
end $$;

create function public.marketplace_dashboard() returns jsonb language sql security definer set search_path='' as $$
 select jsonb_build_object(
 'profile',jsonb_build_object('name',u.raw_user_meta_data->>'name','email',u.email),
 'products',(select count(*) from public.marketplace_products where owner_id=u.id),
 'orders',coalesce((select jsonb_agg(to_jsonb(o) order by o.created_at desc) from public.marketplace_orders o where o.seller_id=u.id or o.buyer_id=u.id),'[]'::jsonb),
 'payments',coalesce((select jsonb_agg(to_jsonb(p) order by p.created_at desc) from public.marketplace_commission_payments p where p.seller_id=u.id),'[]'::jsonb),
 'user_id',u.id) from auth.users u where u.id=auth.uid();
$$;

revoke all on function public.place_marketplace_order(uuid,uuid,numeric,text,text,numeric),public.set_marketplace_order_status(uuid,text),public.submit_commission_payment(uuid,date,numeric,text,date,text),public.marketplace_dashboard() from public,anon;
grant execute on function public.place_marketplace_order(uuid,uuid,numeric,text,text,numeric),public.set_marketplace_order_status(uuid,text),public.submit_commission_payment(uuid,date,numeric,text,date,text),public.marketplace_dashboard() to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('commission-receipts','commission-receipts',false,5242880,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy commission_receipt_read on storage.objects for select to authenticated using(bucket_id='commission-receipts' and (storage.foldername(name))[1]=auth.uid()::text);
create policy commission_receipt_upload on storage.objects for insert to authenticated with check(bucket_id='commission-receipts' and (storage.foldername(name))[1]=auth.uid()::text);
create policy commission_receipt_private on storage.objects as restrictive for select to public using(bucket_id<>'commission-receipts' or (storage.foldername(name))[1]=auth.uid()::text);
create policy commission_receipt_insert_boundary on storage.objects as restrictive for insert to public with check(bucket_id<>'commission-receipts' or (storage.foldername(name))[1]=auth.uid()::text);
create policy commission_receipt_no_change on storage.objects as restrictive for update to public using(bucket_id<>'commission-receipts');
create policy commission_receipt_no_delete on storage.objects as restrictive for delete to public using(bucket_id<>'commission-receipts');

create function public.verify_marketplace_commission_payment(payment_id uuid, approved boolean) returns void
language plpgsql set search_path='' as $$
begin
  if approved is null then raise exception 'Choose approval or rejection.'; end if;
  update public.marketplace_commission_payments set status=case when approved then 'Paid' else 'Rejected' end,
    verified_at=now(),verified_by=current_user where id=payment_id and status='Pending Verification';
  if not found then raise exception 'Pending payment not found.'; end if;
end $$;
revoke all on function public.verify_marketplace_commission_payment(uuid,boolean) from public,anon,authenticated;
grant execute on function public.verify_marketplace_commission_payment(uuid,boolean) to service_role;
grant all on public.marketplace_commission_payments to service_role;

do $$ begin
  assert not has_table_privilege('authenticated','public.marketplace_orders','UPDATE'), 'Orders must only change through the checked RPC';
  assert not has_table_privilege('authenticated','public.marketplace_commission_payments','UPDATE'), 'Sellers must not verify their own payments';
  assert not has_table_privilege('authenticated','public.marketplace_commission_settings','UPDATE'), 'Sellers must not change the commission rate';
  assert not has_function_privilege('authenticated','public.verify_marketplace_commission_payment(uuid,boolean)','EXECUTE'), 'Verification is administrator-only';
end $$;
do $$ declare t text; begin
  if exists(select 1 from pg_publication where pubname='supabase_realtime') then
    foreach t in array array['marketplace_orders','marketplace_commission_payments'] loop
      if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename=t) then
        execute format('alter publication supabase_realtime add table public.%I',t);
      end if;
    end loop;
  end if;
end $$;
commit;
