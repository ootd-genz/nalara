create extension if not exists pgcrypto;

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  public_token text not null unique,
  package_id text not null,
  package_name text not null,
  amount integer not null check (amount > 0),
  currency text not null default 'IDR' check (currency = 'IDR'),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  business_name text not null,
  status text not null default 'creating' check (status in ('creating', 'pending', 'paid', 'failed', 'expired')),
  snap_token text,
  midtrans_transaction_id text,
  payment_type text,
  transaction_time text,
  paid_at timestamptz,
  whatsapp_claimed_at timestamptz,
  whatsapp_sent_at timestamptz,
  whatsapp_message_id text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_orders_status_idx on public.payment_orders (status, created_at desc);
create index if not exists payment_orders_customer_phone_idx on public.payment_orders (customer_phone, created_at desc);

alter table public.payment_orders enable row level security;

create or replace function public.set_payment_orders_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists payment_orders_updated_at on public.payment_orders;
create trigger payment_orders_updated_at
before update on public.payment_orders
for each row execute function public.set_payment_orders_updated_at();

create or replace function public.claim_payment_whatsapp(p_order_id text)
returns setof public.payment_orders
language sql
security definer
set search_path = public
as $$
  update public.payment_orders
  set whatsapp_claimed_at = now(), last_error = null
  where order_id = p_order_id
    and status = 'paid'
    and whatsapp_sent_at is null
    and (whatsapp_claimed_at is null or whatsapp_claimed_at < now() - interval '10 minutes')
  returning *;
$$;

revoke all on public.payment_orders from anon, authenticated;
revoke all on function public.claim_payment_whatsapp(text) from public, anon, authenticated;
grant all on public.payment_orders to service_role;
grant execute on function public.claim_payment_whatsapp(text) to service_role;
