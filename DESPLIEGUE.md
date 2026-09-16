# Publicar Emapan en Supabase y Vercel

La aplicación usa Next.js en Vercel, PostgreSQL y Storage en Supabase y acceso privado con correo y contraseña de Supabase Auth. No requiere bases de datos ni servidores locales.

## 1. Supabase

1. Crea un proyecto y guarda su contraseña de base de datos.
2. Abre SQL Editor, pega **supabase/01-schema.sql** y pulsa Run. Crea cinco tablas, índices, RLS y el bucket privado `machine-images`. No ejecutes los SQL de `drizzle/`: son las migraciones antiguas de SQLite/Cloudflare.
3. En Authentication > Users > Add user crea tu usuario con correo y contraseña y confirma el correo (Auto Confirm). Desactiva el registro público en la configuración de Authentication si solo vas a usar esta cuenta.
4. En **supabase/02-admin.sql**, sustituye `TU_CORREO_ADMIN` por ese correo y ejecuta el SQL. Solo ese identificador de usuario podrá gestionar la web. Repetirlo con otro correo cambia el administrador.
5. En Connect selecciona **Transaction pooler**, puerto **6543**, y copia la URI completa para `DATABASE_URL`. Sustituye la contraseña y codifica sus caracteres especiales como componente de URL. No copies literalmente los marcadores del ejemplo.
6. Copia Project URL y una clave de servidor (service_role o secret key) de la configuración API.

No hacen falta tablas de productos de ejemplo: las referencias de fabricantes ya están en el código. Las máquinas usadas se incorporan desde `/gestion`. Este SQL crea una base nueva; no importa datos ni imágenes de un despliegue anterior en Cloudflare.

## 2. GitHub

El directorio recibido no tenía repositorio Git inicializado. Crea primero el repositorio vacío en GitHub si todavía no existe (sin README ni licencia automáticos), y ejecuta:

```sh
cd /Users/alejandropayavarea/Desktop/el-obrador-emapan
git init
git add .
git diff --cached --stat
git commit -m "Preparar Emapan para Supabase y Vercel"
git branch -M main
git remote add origin https://github.com/TinyChat-up/El-obrador-Emapan.git
git push -u origin main
```

Si `origin` ya existe, sustituye el comando `remote add` por `git remote set-url origin https://github.com/TinyChat-up/El-obrador-Emapan.git`. Si GitHub ya contiene commits, no fuerces el push: integra primero ese historial. GitHub puede pedir autenticación mediante su navegador, SSH o un token; no admite tu contraseña de cuenta para Git por HTTPS.

`.env.example` se publica con marcadores; los archivos `.env` reales están excluidos por `.gitignore`.

## 3. Vercel

1. Add New > Project > importa `TinyChat-up/El-obrador-Emapan`.
2. Framework: **Next.js**. Root Directory: raíz del repositorio. Node.js: **24.x**. La instalación y el build ya están en `vercel.json`. No configures `dist` como Output Directory; deja el valor de Next.js.
3. Añade estas variables antes de Deploy, usando los nombres de `.env.example`:

| Variable | Valor |
| --- | --- |
| `DATABASE_URL` | URI del Transaction pooler de Supabase |
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave secreta del servidor Supabase |
| `NOTIFICATION_EMAIL` | Correo comercial que recibe solicitudes |
| `WHATSAPP_NUMBER` | Número internacional, por ejemplo `34600111222` |
| `LIVE_INQUIRIES` | `true` para producción, `false` para pruebas |
| `RESEND_API_KEY` | Opcional, clave de Resend para avisos automáticos |
| `FROM_EMAIL` | Opcional, remitente de un dominio verificado en Resend |
| `WHATSAPP_PHONE_ID` | Opcional, Phone number ID del remitente en Meta |
| `WHATSAPP_TOKEN` | Opcional, token permanente del usuario de sistema |
| `WHATSAPP_TO` | Opcional, tu número que recibe los avisos |
| `WHATSAPP_TEMPLATE` | Opcional, por defecto `aviso_solicitud` |
| `WHATSAPP_TEMPLATE_LANG` | Opcional, por defecto `es` |

Las tres primeras son obligatorias. Ninguna clave secreta debe tener prefijo `NEXT_PUBLIC_`. Activa las variables en Production; si habilitas Preview, usa preferiblemente otro proyecto Supabase para no alterar datos reales. Después de cambiar variables, haz Redeploy.

4. Pulsa Deploy. En Supabase > Authentication > URL Configuration pon la URL HTTPS final de Vercel (o tu dominio) como Site URL.
5. Abre `/acceso`, inicia sesión con el usuario creado y entra en `/gestion`. La sesión caduca según el plazo del token de Supabase; vuelve a iniciar sesión cuando caduque.
6. Completa los datos comerciales y de privacidad en Ajustes. Si guardas ajustes en el panel, esos valores prevalecen sobre las variables de correo, WhatsApp y consultas reales.

## 3 bis. Avisos automáticos por WhatsApp (opcional)

`WHATSAPP_NUMBER` **no envía nada**: es el enlace `wa.me` que ve el cliente al
terminar el formulario, y solo te escribe si él pulsa el botón. Para que cada
solicitud te llegue sola al móvil hay que conectar la WhatsApp Cloud API de Meta.

Como los avisos van únicamente a tu propio número, cabe en el nivel de pruebas
de Meta: número remitente prestado, hasta cinco destinatarios, sin verificar el
negocio y sin coste. Si algún día quieres remitente propio o más destinatarios,
tendrás que verificar el negocio y pagar por mensaje según la tarifa vigente.

1. En `developers.facebook.com` crea una app de tipo **Empresa** y añade el
   producto **WhatsApp**. Se genera una cuenta de WhatsApp Business de pruebas.
2. En **WhatsApp > API Setup** copia el **Phone number ID** del remitente — es
   un número largo, no un teléfono — y ponlo en `WHATSAPP_PHONE_ID`.
3. En el desplegable **To** añade tu número personal como destinatario de
   prueba y confirma el código que te llega por WhatsApp. Ese mismo número, en
   formato internacional y solo con dígitos, va en `WHATSAPP_TO`.
4. En **WhatsApp Manager > Plantillas de mensajes** crea una plantilla de
   categoría **Utilidad**, idioma **Español**, nombre `aviso_solicitud`, con
   exactamente tres variables en el cuerpo:

   ```
   Nuevo aviso de Emapan: {{1}}. Referencia: {{2}}. Datos: {{3}}
   ```

   Rellena los ejemplos que pide Meta y envíala a revisión. Suele aprobarse en
   minutos. Si le pones otro nombre o idioma, indícalos en `WHATSAPP_TEMPLATE`
   y `WHATSAPP_TEMPLATE_LANG`.
5. El token que muestra API Setup **caduca en 24 horas**. Para producción crea
   en **Business Settings > Usuarios del sistema** un usuario de sistema, dale
   acceso a la app y genera un token con los permisos
   `whatsapp_business_messaging` y `whatsapp_business_management`. Ese token no
   caduca: es el de `WHATSAPP_TOKEN`.
6. Añade las variables en Vercel y haz **Redeploy**. En `/gestion` el indicador
   «Avisos WhatsApp» pasará a **Automático**.

Los dos canales son independientes. Si uno falla, la solicitud queda guardada
igualmente y la ficha muestra «Aviso parcial»; el botón de reintento del panel
vuelve a lanzar los dos.

## 4. Comprobación en producción

- Abre el catálogo y una ficha de referencia.
- Inicia sesión y publica una máquina usada con una fotografía.
- En una ventana privada, comprueba que `/gestion` pide acceso.
- Envía una consulta y una valoración de máquina y comprueba que aparecen en gestión.
- Si configuras Resend, comprueba también la recepción del correo; un aviso fallido no elimina la solicitud guardada.

Las fotografías admiten hasta **4 MiB por imagen** y las valoraciones **4 MiB en total** (entre 1 y 8 imágenes). El límite deja margen para el formulario dentro de los 4,5 MB de Vercel. Las fotografías servidas en `/api/media/…` son accesibles para quien tenga su URL; no subas documentos confidenciales.

## Referencias oficiales

- https://supabase.com/docs/guides/database/connecting-to-postgres
- https://supabase.com/docs/guides/auth/passwords
- https://vercel.com/docs/functions/limitations
- https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
- https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates
