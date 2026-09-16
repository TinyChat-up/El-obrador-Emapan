-- Primero: Authentication > Users > Add user en Supabase.
-- Sustituye el correo por el de TU usuario confirmado antes de ejecutar.
do $$
declare admin_uuid uuid;
begin
 select id into admin_uuid from auth.users where lower(email)=lower('TU_CORREO_ADMIN');
 if admin_uuid is null then raise exception 'Crea primero el usuario y sustituye TU_CORREO_ADMIN'; end if;
 insert into public.admins(id,user_id) values(2,admin_uuid::text)
 on conflict(id) do update set user_id=excluded.user_id;
end $$;
