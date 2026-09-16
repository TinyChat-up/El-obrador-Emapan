-- Ejecutar en el SQL Editor del proyecto de Supabase (una sola vez).
-- Los JSON se conservan como texto para mantener el formato de la aplicación.
begin;
create table if not exists public.admins (id integer primary key, user_id text not null);
create table if not exists public.machines (id text primary key, data text not null, published integer not null default 0, updated text not null);
create table if not exists public.settings (id integer primary key, data text not null);
create table if not exists public.inquiries (id text primary key, data text not null, status text not null default 'Nueva', notification text not null default 'pending', created text not null, ip_hash text not null);
create index if not exists idx_inquiries_created on public.inquiries(created);
create index if not exists idx_inquiries_ip_created on public.inquiries(ip_hash,created);
create table if not exists public.machine_offers (id text primary key, data text not null, status text not null default 'Nueva', notification text not null default 'pending', created text not null, ip_hash text not null);
create index if not exists idx_machine_offers_created on public.machine_offers(created);
create index if not exists idx_machine_offers_ip_created on public.machine_offers(ip_hash,created);
alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;
alter table public.machines enable row level security;
revoke all on public.machines from anon, authenticated;
alter table public.settings enable row level security;
revoke all on public.settings from anon, authenticated;
alter table public.inquiries enable row level security;
revoke all on public.inquiries from anon, authenticated;
alter table public.machine_offers enable row level security;
revoke all on public.machine_offers from anon, authenticated;
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('machine-images','machine-images',false,4194304,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
commit;
-- Sin políticas públicas: las tablas se consultan desde Vercel mediante DATABASE_URL.
-- El bucket privado se utiliza únicamente desde el servidor con la clave secreta.
