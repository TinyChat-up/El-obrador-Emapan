# El Obrador de Emapan

Catálogo de maquinaria, comparador, solicitudes comerciales y panel privado.

## Publicación

Consulta [DESPLIEGUE.md](DESPLIEGUE.md) para crear la base en Supabase, configurar Vercel y subir a GitHub. No necesitas servicios locales.

- SQL: [esquema y Storage](supabase/01-schema.sql) y [administrador](supabase/02-admin.sql).
- Variables del servidor: [.env.example](.env.example).
- Producción: Next.js + Supabase PostgreSQL, Auth y Storage.
- Comandos de plataforma: `pnpm install --frozen-lockfile` y `pnpm build`.

Los archivos de Cloudflare/Vinext, `drizzle/`, `OPERATIONS.md` y los documentos de exportación se conservan como antecedentes; no son instrucciones del despliegue actual. El procedimiento vigente es DESPLIEGUE.md.
