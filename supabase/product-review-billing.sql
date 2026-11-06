-- Run after marketplace.sql and seller-dashboard.sql. Existing monthly records are preserved.
begin;
alter table public.marketplace_products add column review_status text not null default 'Approved' check(review_status in ('Pending','Approved','Rejected'));
alter table public.marketplace_products alter column review_status set default 'Pending';
alter table public.marketplace_products add column reviewed_at timestamptz;

create function public.guard_product_review() returns trigger language plpgsql set search_path='' as $$
begin
  if current_user in ('anon','authenticated') then
    if tg_op='INSERT' then new.review_status:='Pending'; new.reviewed_at:=null; new.created_at:=clock_timestamp();
    elsif new.review_status is distinct from old.review_status or new.reviewed_at is distinct from old.reviewed_at then raise exception 'Only administrators can approve products.';
    elsif (to_jsonb(new)-array['stock','status','updated_at','review_status','reviewed_at']) is distinct from (to_jsonb(old)-array['stock','status','updated_at','review_status','reviewed_at']) then
      new.review_status:='Pending';new.reviewed_at:=null;
    end if;
  end if;
  return new;
end $$;
create trigger product_review_guard before insert or update on public.marketplace_products for each row execute function public.guard_product_review();
drop policy marketplace_read on public.marketplace_products;
create policy marketplace_read on public.marketplace_products for select to anon,authenticated using(review_status='Approved' or owner_id=auth.uid());
-- Restrictive policy also protects against any other broad SELECT policy.
create policy marketplace_review_visibility on public.marketplace_products as restrictive for select to public using(review_status='Approved' or owner_id=auth.uid());

create function public.review_marketplace_product(product uuid, approved boolean) returns void language plpgsql set search_path='' as $$
begin
  if approved is null then raise exception 'Choose approval or rejection.'; end if;
  update public.marketplace_products set review_status=case when approved then 'Approved' else 'Rejected' end,reviewed_at=now() where id=product;
  if not found then raise exception 'Product not found.'; end if;
end $$;
revoke all on function public.review_marketplace_product(uuid,boolean) from public,anon,authenticated;
grant execute on function public.review_marketplace_product(uuid,boolean) to service_role;

alter table public.marketplace_orders add column product_posted_at timestamptz;
alter table public.marketplace_orders add column billing_product_id uuid;
alter table public.marketplace_orders add column billing_key text;
alter table public.marketplace_orders add column billing_start timestamptz;
alter table public.marketplace_orders add column billing_end timestamptz;
-- Snapshot dates for outstanding orders, without rewriting completed monthly statements.
update public.marketplace_orders o set product_posted_at=p.created_at,billing_product_id=p.id from public.marketplace_products p where o.product_id=p.id and o.status in ('Pending','Confirmed');

create function public.guard_product_billing() returns trigger language plpgsql security definer set search_path='' as $$
declare p public.marketplace_products; cycle bigint;
begin
  if tg_op='INSERT' then
    select * into p from public.marketplace_products where id=new.product_id;
    if not found or p.review_status<>'Approved' then raise exception 'This product is awaiting approval.'; end if;
    new.product_posted_at:=p.created_at;new.billing_product_id:=p.id;
  elsif new.status='Completed' and old.status<>'Completed' and new.product_posted_at is not null then
    cycle:=greatest(0,floor(extract(epoch from (new.completed_at-new.product_posted_at))/2592000)::bigint);
    new.billing_start:=new.product_posted_at+(cycle*interval '720 hours');
    new.billing_end:=new.billing_start+interval '720 hours';
    new.billing_key:=new.billing_product_id::text || ':' || cycle::text;
    new.due_date:=(new.billing_end at time zone 'Asia/Manila')::date;
  end if;
  return new;
end $$;
create trigger product_billing_guard before insert or update on public.marketplace_orders for each row execute function public.guard_product_billing();

alter table public.marketplace_commission_payments add column billing_key text;
alter table public.marketplace_commission_payments add column period_start timestamptz;
alter table public.marketplace_commission_payments add column period_end timestamptz;

create function public.submit_product_cycle_payment(payment_id uuid,billing_key text,paid numeric,reference_number text,paid_on date,receipt text default null) returns uuid
language plpgsql security definer set search_path='' as $$
declare o public.marketplace_orders;
begin
  if auth.uid() is null then raise exception 'Sign in first.'; end if;
  if exists(select 1 from public.marketplace_commission_payments p where p.id=payment_id and p.seller_id=auth.uid() and p.billing_key=submit_product_cycle_payment.billing_key and p.amount=paid and p.reference=reference_number and p.payment_date=paid_on and p.receipt_path is not distinct from receipt) then return payment_id; end if;
  select * into o from public.marketplace_orders q where q.seller_id=auth.uid() and q.billing_key=submit_product_cycle_payment.billing_key and q.status='Completed' limit 1;
  if not found or o.billing_end>now() then raise exception 'Choose a completed 30-day billing period.'; end if;
  if paid is null or paid<=0 or paid>1000000000 or paid<>round(paid,2) or paid_on is null or paid_on>(now() at time zone 'Asia/Manila')::date or reference_number is null or reference_number !~ '^[0-9]{10,20}$' then raise exception 'Invalid payment details.'; end if;
  if receipt is not null and (receipt not like auth.uid()::text || '/%' or not exists(select 1 from storage.objects where bucket_id='commission-receipts' and name=receipt)) then raise exception 'Invalid receipt.'; end if;
  insert into public.marketplace_commission_payments(id,seller_id,month,amount,reference,payment_date,receipt_path,billing_key,period_start,period_end)
  values(payment_id,auth.uid(),date_trunc('month',o.billing_start at time zone 'Asia/Manila')::date,paid,reference_number,paid_on,receipt,o.billing_key,o.billing_start,o.billing_end);
  return payment_id;
end $$;
revoke all on function public.submit_product_cycle_payment(uuid,text,numeric,text,date,text) from public,anon;
grant execute on function public.submit_product_cycle_payment(uuid,text,numeric,text,date,text) to authenticated;

-- The legacy monthly submission function must not accept new cycle sales as monthly dues.
create or replace function public.submit_commission_payment(payment_id uuid,billing_month date,paid numeric,reference_number text,paid_on date,receipt text default null) returns uuid
language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is null then raise exception 'Sign in first.'; end if;
  if exists(select 1 from public.marketplace_commission_payments p where p.id=payment_id and p.seller_id=auth.uid() and p.billing_key is null and p.month=billing_month and p.amount=paid and p.reference=reference_number and p.payment_date=paid_on and p.receipt_path is not distinct from receipt) then return payment_id; end if;
  if billing_month is null or extract(day from billing_month)<>1 or billing_month>=date_trunc('month',now() at time zone 'Asia/Manila')::date or paid is null or paid<=0 or paid>1000000000 or paid<>round(paid,2) or paid_on is null or paid_on>(now() at time zone 'Asia/Manila')::date or reference_number is null or reference_number !~ '^[0-9]{10,20}$' then raise exception 'Invalid payment details.'; end if;
  if not exists(select 1 from public.marketplace_orders where seller_id=auth.uid() and status='Completed' and billing_key is null and date_trunc('month',completed_at at time zone 'Asia/Manila')::date=billing_month) then raise exception 'No legacy monthly sales.'; end if;
  if receipt is not null and (receipt not like auth.uid()::text || '/%' or not exists(select 1 from storage.objects where bucket_id='commission-receipts' and name=receipt)) then raise exception 'Invalid receipt.'; end if;
  insert into public.marketplace_commission_payments(id,seller_id,month,amount,reference,payment_date,receipt_path) values(payment_id,auth.uid(),billing_month,paid,reference_number,paid_on,receipt);
  return payment_id;
end $$;

create or replace function public.marketplace_dashboard() returns jsonb language sql security definer set search_path='' as $$
 select jsonb_build_object('profile',jsonb_build_object('name',u.raw_user_meta_data->>'name','email',u.email),
 'products',(select count(*) from public.marketplace_products where owner_id=u.id),
 'listings',coalesce((select jsonb_agg(jsonb_build_object('id',p.id,'name',p.name,'created_at',p.created_at,'review_status',p.review_status,'stock',p.stock,'unit',p.unit,'photo_url',p.photo_url) order by p.created_at desc) from public.marketplace_products p where p.owner_id=u.id),'[]'::jsonb),
 'orders',coalesce((select jsonb_agg(to_jsonb(o) order by o.created_at desc) from public.marketplace_orders o where o.seller_id=u.id or o.buyer_id=u.id),'[]'::jsonb),
 'payments',coalesce((select jsonb_agg(to_jsonb(p) order by p.created_at desc) from public.marketplace_commission_payments p where p.seller_id=u.id),'[]'::jsonb),
 'user_id',u.id) from auth.users u where u.id=auth.uid();
$$;
commit;
