# Publicar Emapan en Vercel

La web es una aplicación Next.js en Vercel. **No usa base de datos ni panel de
administración**: el catálogo y los datos de la empresa viven en el código
(`lib/stock.ts` y `lib/catalog.ts`). De Supabase solo se usa Storage, para
guardar las fotografías que envían los clientes desde `/vender`.

Las solicitudes no se almacenan en ninguna parte: te llegan por correo y por
WhatsApp. Si ningún canal está configurado, el formulario avisa al cliente de
que no se ha podido registrar en lugar de perderla en silencio.

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
| `NOTIFICATION_EMAIL` | Correo comercial que recibe solicitudes |
| `WHATSAPP_NUMBER` | Número internacional, por ejemplo `34600111222` |
| `LIVE_INQUIRIES` | `true` para producción, `false` para pruebas |
| `RESEND_API_KEY` | Clave de Resend para el aviso por correo |
| `FROM_EMAIL` | Remitente de un dominio verificado en Resend |
| `WHATSAPP_PHONE_ID` | Phone number ID del remitente en Meta |
| `WHATSAPP_TOKEN` | Token permanente del usuario de sistema |
| `WHATSAPP_TO` | Tu número, que recibe los avisos |
| `WHATSAPP_TEMPLATE` | Opcional, por defecto `aviso_solicitud` |
| `WHATSAPP_TEMPLATE_LANG` | Opcional, por defecto `es` |

Ninguna clave lleva prefijo `NEXT_PUBLIC_`. **Después de cambiar variables hay
que hacer Redeploy**: un despliegue ya creado no las ve.

4. Deploy.

## 4. Gestionar el catálogo

Todo desde el código, sin panel:

- **Máquinas de segunda mano** → `lib/stock.ts`. Copia el ejemplo comentado del
  principio del archivo, edítalo y haz push. Para retirar una máquina, borra su
  bloque o pon `published:false`. También puedes marcar `availability:'Vendida'`
  para conservar la ficha sin que aparezca en el catálogo.
- **Fotografías** → guárdalas en `public/images/` y nómbralas en `fotos:[...]`.
- **Datos de la empresa** → constante `settings` en `lib/catalog.ts`. El NIF, la
  dirección y el correo de privacidad son obligatorios para publicar consultas
  reales.
- **Modelos nuevos de referencia** → array `demos` en `lib/catalog.ts`.

## 4 bis. Avisos automáticos por WhatsApp

Sin base de datos, los avisos son el único registro de una solicitud, así que conviene tener los dos canales. `WHATSAPP_NUMBER` **no envía nada**: es el enlace `wa.me` que ve el cliente al
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

## 5. Comprobación en producción

- Abre el catálogo, una ficha y el comparador.
- Envía una consulta y comprueba que te llega el correo y el WhatsApp.
- Envía una valoración desde `/vender` con fotografías y comprueba que los
  enlaces del aviso abren las imágenes.
- Con `LIVE_INQUIRIES=false` los formularios funcionan pero no envían nada.

Las fotografías admiten hasta **4 MiB por imagen** y las valoraciones **4 MiB en
total** (entre 1 y 8 imágenes). Las fotos servidas en `/api/media/…` son
accesibles para quien tenga su URL; no subas documentos confidenciales.

## Referencias oficiales

- https://vercel.com/docs/functions/limitations
- https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
- https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates
