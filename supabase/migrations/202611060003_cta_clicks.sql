-- ==============================================================================
-- Migrasi: Tracking Klik CTA WhatsApp per User (cta_clicks)
-- Proyek: NALARA
-- Tanggal: 6 November 2026
--
-- PENTING / PETUNJUK:
-- File migrasi ini dijalankan secara MANUAL di Supabase SQL Editor pada dashboard
-- project Anda. Jangan berasumsi migrasi ini telah dieksekusi secara otomatis.
-- ==============================================================================

-- 1. Tabel cta_clicks: menyimpan log interaksi klik tombol CTA WhatsApp
create table if not exists public.cta_clicks (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.site_users(id) on delete set null,
  slug         text not null check (char_length(slug) between 1 and 100),
  cta_location text not null check (
    cta_location in (
      'hero',
      'offer-beginner',
      'offer-starter',
      'offer-business',
      'floating',
      'footer',
      'portfolio-banner'
    )
  ),
  package      text check (
    package is null or package in ('beginner', 'starter', 'business')
  ),
  created_at   timestamptz not null default now()
);

-- 2. Index untuk performa aggregasi dan filtering
create index if not exists idx_cta_clicks_user_id_created_at
  on public.cta_clicks (user_id, created_at desc);

create index if not exists idx_cta_clicks_created_at
  on public.cta_clicks (created_at desc);

create index if not exists idx_cta_clicks_slug
  on public.cta_clicks (slug);

-- 3. Row Level Security (RLS)
alter table public.cta_clicks enable row level security;

-- a. Publik (anon dan authenticated) diizinkan INSERT saja (tanpa select/update/delete)
drop policy if exists "anon insert cta_clicks" on public.cta_clicks;
create policy "anon insert cta_clicks"
  on public.cta_clicks
  for insert
  to anon, authenticated
  with check (true);

-- b. Hanya admin (terdaftar di tabel public.admins) yang dapat SELECT data cta_clicks
drop policy if exists "admin select cta_clicks" on public.cta_clicks;
create policy "admin select cta_clicks"
  on public.cta_clicks
  for select
  to authenticated
  using (
    exists (
      select 1 from public.admins a
      where a.user_id = auth.uid()
    )
  );

-- Hak akses level tabel
grant insert on public.cta_clicks to anon, authenticated;
grant select on public.cta_clicks to authenticated;
grant all on public.cta_clicks to service_role;

-- 4. Fungsi RPC untuk agregasi metrik klik per user (Hanya Admin)
create or replace function public.get_user_cta_stats()
returns table (
  user_id uuid,
  slug text,
  total_clicks bigint,
  clicks_7d bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.admins a where a.user_id = auth.uid()) then
    raise exception 'Akses ditolak: Hanya admin yang diizinkan';
  end if;

  return query
  select
    c.user_id,
    c.slug,
    count(*)::bigint as total_clicks,
    count(*) filter (where c.created_at >= now() - interval '7 days')::bigint as clicks_7d
  from public.cta_clicks c
  where c.user_id is not null
  group by c.user_id, c.slug;
end;
$$;

revoke all on function public.get_user_cta_stats() from public;
grant execute on function public.get_user_cta_stats() to authenticated;

-- 5. Fungsi RPC untuk statistik global klik CTA (Hanya Admin)
create or replace function public.get_global_cta_stats()
returns table (
  total_clicks bigint,
  clicks_7d bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.admins a where a.user_id = auth.uid()) then
    raise exception 'Akses ditolak: Hanya admin yang diizinkan';
  end if;

  return query
  select
    count(*)::bigint as total_clicks,
    count(*) filter (where created_at >= now() - interval '7 days')::bigint as clicks_7d
  from public.cta_clicks;
end;
$$;

revoke all on function public.get_global_cta_stats() from public;
grant execute on function public.get_global_cta_stats() to authenticated;
