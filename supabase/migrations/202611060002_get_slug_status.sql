-- Migrasi: Fungsi RPC get_slug_status untuk mengecek status slug tanpa mengekspos data pribadi
-- Digunakan oleh route dinamis /[slug] untuk membedakan slug nonaktif (redirect ke /) dan slug tidak ditemukan (404).

create or replace function public.get_slug_status(p_slug text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_is_active boolean;
begin
  if p_slug is null or trim(p_slug) = '' then
    return 'missing';
  end if;

  select su.is_active into v_is_active
  from public.site_users su
  where su.slug = lower(trim(p_slug));

  if not found then
    return 'missing';
  elsif v_is_active then
    return 'active';
  else
    return 'inactive';
  end if;
end;
$$;

-- Cabut akses publik bawaan dan izinkan eksplisit hanya untuk anon dan authenticated
revoke all on function public.get_slug_status(text) from public;
grant execute on function public.get_slug_status(text) to anon, authenticated;
