# Publicar Emapan en Vercel

La web es una aplicación Next.js en Vercel. **No usa base de datos ni panel de
administración**: el catálogo y los datos de la empresa viven en el código
(`lib/used-machines.ts` y `lib/catalog.ts`). De Supabase solo se usa Storage, para
guardar las fotografías que envían los clientes desde `/vender`.

Las solicitudes no se almacenan en ninguna parte: te llegan por correo. Si el
correo no está configurado o falla, el formulario avisa al cliente de que no se
ha podido registrar en lugar de perderla en silencio.

## 1. Supabase (solo para las fotos)

1. Crea un proyecto.
2. SQL Editor → pega **supabase/01-storage.sql** → Run. Crea el bucket privado
   `machine-images`. Es el único SQL del proyecto.
3. Settings → API: copia **Project URL** y una clave de servidor
   (`service_role` o *secret key*).

No hace falta Authentication, ni tablas, ni contraseña de base de datos.

## 2. GitHub

El repositorio ya está creado y enlazado. Para publicar cambios:

```sh
cd /Users/alejandropayavarea/Desktop/el-obrador-emapan
git add -A
git commit -m "Describe aquí el cambio"
git push
```

## 3. Vercel

1. Add New → Project → importa `TinyChat-up/El-obrador-Emapan`.
2. Framework **Next.js**, Root Directory la raíz. La instalación y el build ya
   están en `vercel.json`.
3. Añade estas variables en **Production** antes de Deploy:

| Variable | Valor |
| --- | --- |
| `SUPABASE_URL` | URL del proyecto Supabase, sin barra final |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave secreta del servidor Supabase |
| `NEXT_PUBLIC_SITE_URL` | Dirección pública con `https://` y sin barra final, p. ej. `https://www.tudominio.es` |
| `NOTIFICATION_EMAIL` | Correo comercial que recibe solicitudes |
| `WHATSAPP_NUMBER` | Número internacional para el botón «Continuar por WhatsApp», por ejemplo `34600111222` |
| `LIVE_INQUIRIES` | `true` para producción, `false` para pruebas |
| `RESEND_API_KEY` | Clave de Resend para el aviso por correo |
| `FROM_EMAIL` | Opcional. Sin ella se usa `onboarding@resend.dev` |

Ninguna clave lleva prefijo `NEXT_PUBLIC_`. **Después de cambiar variables hay
que hacer Redeploy**: un despliegue ya creado no las ve.

4. Deploy.

## 4. Gestionar el catálogo

Todo desde el código, sin panel. Instrucciones paso a paso en el
[README](README.md#añadir-una-máquina-de-segunda-mano).

## 4 bis. Avisos

Sin base de datos, el correo es el único registro de una solicitud: sin
`RESEND_API_KEY` y `NOTIFICATION_EMAIL`, los formularios en producción
responden con error.

Sin `FROM_EMAIL` se envía desde `onboarding@resend.dev`, el remitente de
pruebas de Resend, que **solo entrega al correo con el que creaste la cuenta de
Resend**: ese debe ser `NOTIFICATION_EMAIL`. Para usar otro destinatario,
verifica un dominio en Resend → Domains y pon `FROM_EMAIL=avisos@tudominio.es`.
El correo llega con «Responder a» apuntando al cliente, así que puedes
contestarle directamente. `WHATSAPP_NUMBER` **no envía nada**: es el
enlace `wa.me` que ve el cliente al terminar el formulario, y solo te escribe si
él pulsa el botón.

## 5. Comprobación en producción

- Abre el catálogo, una ficha y el comparador.
- Envía una consulta y comprueba que te llega el correo.
- Envía una valoración desde `/vender` con fotografías y comprueba que los
  enlaces del aviso abren las imágenes.
- Con `LIVE_INQUIRIES=false` los formularios funcionan pero no envían nada.

Las fotografías admiten hasta **4 MiB por imagen** y las valoraciones **4 MiB en
total** (entre 1 y 8 imágenes). Las fotos servidas en `/api/media/…` son
accesibles para quien tenga su URL; no subas documentos confidenciales.

## Dominio propio

1. Vercel → proyecto → **Settings → Domains** → Add → escribe `tudominio.es` y
   añade también `www.tudominio.es`. Elige cuál es el principal (recomendado
   `www`) y deja que el otro redirija a él.
2. En el panel de tu proveedor del dominio crea los registros DNS que indica
   Vercel. Normalmente:
   - `A` para `@` apuntando a la IP que muestra Vercel.
   - `CNAME` para `www` apuntando al valor que muestra Vercel.
   Si Vercel lo propone, también puedes cambiar los *nameservers* a Vercel.
3. Espera a que Vercel marque el dominio como **Valid Configuration** (de
   minutos a unas horas). El certificado HTTPS se crea solo.
4. Settings → Environment Variables → `NEXT_PUBLIC_SITE_URL` =
   `https://www.tudominio.es` (Production) → **Redeploy**. Con esto se
   actualizan canónicas, sitemap, robots y datos estructurados.
5. Da de alta el dominio en Google Search Console y envía
   `https://www.tudominio.es/sitemap.xml`.
6. Opcional: verifica el dominio en Resend y pon `FROM_EMAIL=avisos@tudominio.es`.

Las vistas previas de Vercel (`VERCEL_ENV=preview`) se sirven con `noindex` y un
robots.txt que bloquea todo, para que Google solo indexe producción.

## Referencias oficiales

- https://vercel.com/docs/functions/limitations
