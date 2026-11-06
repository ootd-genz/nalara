-- ==============================================================================
-- Migrasi: Manajemen User & Landing Page Dinamis (site_users & admins)
-- Proyek: NALARA
-- Tanggal: 6 November 2026
--
-- PENTING / PETUNJUK:
-- File migrasi ini dijalankan secara MANUAL di Supabase SQL Editor pada dashboard
-- project Anda. Jangan berasumsi migrasi ini telah dieksekusi secara otomatis.
--
-- File ini mencatat skema tabel, fungsi trigger, index, dan Row Level Security (RLS)
-- untuk fitur URL personal slug (/nama-user) dan autentikasi admin.
-- ==============================================================================

-- 1. Pastikan ekstensi pgcrypto tersedia untuk gen_random_uuid()
create extension if not exists pgcrypto;

-- 2. Tabel site_users: menyimpan mitra/user dengan slug dan nomor WhatsApp
create table if not exists public.site_users (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null check (char_length(name) between 2 and 80),
  slug        text        not null unique
              check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 60),
  phone_raw   text        not null,            -- input asli admin, untuk tampilan UI admin
  phone_wa    text        not null check (phone_wa ~ '^628[0-9]{7,12}$'),
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index parsial untuk query cepat rute publik /[slug] (hanya user aktif)
create index if not exists site_users_active_slug_idx on public.site_users (slug) where is_active;

-- Trigger otomatis untuk memperbarui kolom updated_at
create or replace function public.set_site_users_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_users_set_updated_at on public.site_users;
create trigger site_users_set_updated_at
before update on public.site_users
for each row execute function public.set_site_users_updated_at();

-- 3. Tabel admins: daftar user_id (dari Supabase Auth) yang memiliki hak akses admin
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- 4. Keamanan & Row Level Security (RLS)
alter table public.site_users enable row level security;
alter table public.admins     enable row level security;

-- Policy site_users:
-- a. Publik (anon & authenticated) hanya boleh membaca user yang aktif
drop policy if exists "public read active users" on public.site_users;
create policy "public read active users"
on public.site_users for select
to anon, authenticated
using (is_active = true);

-- b. Hanya admin (terdaftar di tabel public.admins) yang boleh membaca semua data & melakukan mutasi (INSERT, UPDATE, DELETE)
drop policy if exists "admin full access" on public.site_users;
create policy "admin full access"
on public.site_users for all
to authenticated
using      (exists (select 1 from public.admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Policy admins:
-- Hanya admin yang bersangkutan yang dapat melihat row admin-nya sendiri
drop policy if exists "read own admin row" on public.admins;
create policy "read own admin row"
on public.admins for select
to authenticated
using (user_id = auth.uid());

-- Hak akses level tabel (RLS tetap memfilter akses baris)
grant select on public.site_users to anon, authenticated;
grant all on public.site_users to authenticated;
grant all on public.site_users to service_role;

grant select on public.admins to authenticated;
grant all on public.admins to service_role;
