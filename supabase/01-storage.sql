-- Único SQL que necesita este proyecto. Ejecútalo una vez en el SQL Editor.
-- La web no usa base de datos: solo el almacén privado de fotografías que
-- suben los clientes desde /vender.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('machine-images','machine-images',false,4194304,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
-- Sin políticas públicas: el bucket se usa solo desde el servidor con la
-- clave secreta, y las fotos se sirven a través de /api/media/…
