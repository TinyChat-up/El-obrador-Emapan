-- Opcional. Ejecutar en el SQL Editor después de 01-schema.sql y 02-admin.sql
-- para comprobar que todo quedó creado. No modifica datos.
select 'tablas' as comprobacion,
       string_agg(table_name, ', ' order by table_name) as resultado
  from information_schema.tables
 where table_schema = 'public'
   and table_name in ('admins','machines','settings','inquiries','machine_offers')
union all
select 'rls activa',
       string_agg(relname, ', ' order by relname)
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
 where n.nspname = 'public' and c.relrowsecurity
   and relname in ('admins','machines','settings','inquiries','machine_offers')
union all
select 'bucket privado',
       coalesce(string_agg(id || ' (public=' || public || ')', ', '), 'FALTA')
  from storage.buckets where id = 'machine-images'
union all
select 'administrador',
       coalesce((select u.email from public.admins a
                   join auth.users u on u.id = a.user_id::uuid
                  where a.id = 2), 'FALTA: ejecuta 02-admin.sql');
-- Las cinco tablas, las cinco con RLS, public=false y un correo: todo correcto.
