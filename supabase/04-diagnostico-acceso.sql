-- Diagnóstico del acceso a /gestion. Solo lee, no modifica nada.
-- Pégalo en el SQL Editor de Supabase y mira la columna "diagnostico".
select
  u.email,
  case when u.email_confirmed_at is null
       then 'SIN CONFIRMAR: el login fallará siempre'
       else 'confirmado' end                                  as confirmacion,
  case when u.banned_until > now() then 'BLOQUEADO hasta ' || u.banned_until
       else 'activo' end                                      as bloqueo,
  case when u.encrypted_password is null or u.encrypted_password = ''
       then 'SIN CONTRASEÑA: creado por enlace mágico, asígnale una'
       else 'tiene contraseña' end                            as password,
  coalesce(u.last_sign_in_at::text, 'nunca ha entrado')        as ultimo_acceso,
  case when a.user_id is null
       then 'NO ES ADMIN: ejecuta 02-admin.sql con este correo'
       else 'admin (fila ' || a.id || ')' end                 as diagnostico
from auth.users u
left join public.admins a on a.user_id = u.id::text and a.id = 2
where u.deleted_at is null
order by u.created_at desc;
