# Pengembangan Supabase Lanjutan

Supabase sudah dipakai sebagai penyimpanan order pembayaran server-side melalui migration `supabase/migrations/202607170001_payment_orders.sql`. Tabel tambahan berikut dapat digunakan pada fase mendatang untuk form lead, testimoni terverifikasi, portofolio, atau dashboard admin.

```sql
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text not null,
  business_name text,
  project_type text,
  message text,
  source text default 'landing-page',
  created_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_role text,
  quote text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text,
  image_url text,
  project_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);
```

RLS: public hanya boleh insert lead dengan validasi; public hanya boleh membaca testimoni/portofolio yang `is_published = true`; update/delete hanya admin. Service role key tidak boleh berada di browser.
