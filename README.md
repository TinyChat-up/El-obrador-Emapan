# El Obrador de Emapan

Catálogo de maquinaria de obrador, comparador y formularios de contacto.
**Todo el contenido se gestiona desde el código**: no hay panel de
administración ni base de datos.

## Gestionar el catálogo

| Qué quieres hacer | Dónde |
| --- | --- |
| Publicar, editar o retirar una máquina de segunda mano | [`lib/stock.ts`](lib/stock.ts) |
| Cambiar los datos de la empresa (NIF, dirección, correo, WhatsApp) | [`lib/catalog.ts`](lib/catalog.ts), constante `settings` |
| Añadir o quitar modelos nuevos de referencia | [`lib/catalog.ts`](lib/catalog.ts), array `demos` |
| Fotografías del catálogo | `public/images/` |

Editas, `git push`, y Vercel publica solo.

## Publicación

Consulta [DESPLIEGUE.md](DESPLIEGUE.md). No necesitas servicios locales.

- SQL: [almacén de fotografías](supabase/01-storage.sql), lo único que hace falta en Supabase.
- Variables del servidor: [.env.example](.env.example).
- Producción: Next.js en Vercel + Supabase Storage para las fotos que envían los clientes.
- Comandos de plataforma: `pnpm install --frozen-lockfile` y `pnpm build`.

Los archivos de Cloudflare/Vinext y los documentos de exportación
(`EMPEZAR-CON-CODEX.md`, `OPERATIONS.md`, `EXPORTACION.json`) se conservan como
antecedentes históricos; no describen el despliegue actual.
