# El Obrador de Emapan — continuar con Codex

Exportación del código del 15 de septiembre de 2026. Abre la carpeta `el-obrador-emapan` en VS Code/Codex.

## Primer mensaje para Codex

> Lee EMPEZAR-CON-CODEX.md y el código existente. Ayúdame a ejecutar este proyecto localmente, conservando su diseño y funcionalidades. Configura una base de datos local con las migraciones existentes y comprueba el catálogo. Antes de probar la administración, resuelve la identidad simulada local sin debilitar la autorización de producción. No publiques cambios hasta que te lo pida.

## Qué contiene

- Código React/TypeScript sobre Vinext y Cloudflare Workers; no es un proyecto Next.js convencional para desplegar directamente en Vercel.
- Catálogo de segunda mano, fichas, formularios de consulta y venta, comparador visual con selector de modelos nuevos con fotografías.
- Administración, activación única, gestión de inventario, imágenes y solicitudes.
- Imágenes originales incluidas en el repositorio, logo de Emapan y fuentes documentadas en SOURCES.md y VINTAGE-SOURCES.md.
- Esquema y migraciones D1, integración con R2, dependencias fijadas y configuración del sitio existente.

## Puesta en marcha local

Requiere Node.js >=22.13 y pnpm compatible con `packageManager` en package.json. Usa ese gestor y el pnpm-lock.yaml; no hace falta copiar node_modules.

```sh
pnpm install --frozen-lockfile
pnpm run build
```

En una copia nueva, aplica las dos migraciones a la base LOCAL, en orden:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_abandoned_blue_marvel.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_wooden_otto_octavius.sql
pnpm run dev
```

Abre la dirección que imprima el servidor. No vuelvas a aplicar manualmente migraciones ya ejecutadas. El perfil portable se selecciona automáticamente cuando no hay configuración local. El README original explica los detalles del entorno.

## Administración y autenticación

En producción, Sites gestiona el inicio de sesión de ChatGPT. El código de activación se comprueba contra `ADMIN_ACTIVATION_HASH`, guardado como secreto del alojamiento. La activación requiere la cuenta `olo.paya@gmail.com` y vincula su identificador específico del sitio en `admins`, fila 2. Todas las APIs privadas comprueban esa vinculación en el servidor.

El código y los secretos de producción NO están en el ZIP. En el alojamiento actual conservan su configuración. `OWNER_SETUP_ENABLED` y `OWNER_ACCOUNT_USER_ID` no son el mecanismo vigente de autorización.

La simulación portable inicia sesión como `local_seedy` / `seedy@sites.test`: por tanto no abre la administración de producción ni satisface el correo de activación. Para probar la gestión, Codex debe configurar expresamente una vinculación de ese usuario solo en la D1 LOCAL. Nunca añadir bypasses de autorización a las rutas de producción. No uses cabeceras de identidad proporcionadas directamente por visitantes si migras a otro alojamiento: necesitarás una capa de autenticación verificada que las sustituya.

## Datos y servicios que no viajan en este ZIP

No incluye una copia de la D1 de producción (inventario añadido, solicitudes, ajustes, administrador) ni objetos R2 (fotos subidas desde la web). Incluye las imágenes estáticas del repositorio y los modelos nuevos de referencia. Los registros reales y sus imágenes requieren una exportación adicional si cambias de alojamiento. Tampoco incluye historial Git, dependencias instaladas, cachés o compilados.

Correo automático: necesita RESEND_API_KEY y FROM_EMAIL de un remitente verificado. No estaba configurado en la última entrega. Las solicitudes se guardan en administración; WhatsApp abre una conversación que el visitante debe enviar. El correo de acceso no sustituye automáticamente al destinatario de consultas.

El sitio actual sigue privado. Antes de abrirlo al público faltan las comprobaciones de datos legales, inventario real, contactos, acceso de administración y entrega de notificaciones. No hay pagos ni compra online.

## Mapa del código

- app/catalog-app.tsx: catálogo, fichas, comparador y consultas.
- app/vintage.css y app/globals.css: estilo azul/blanco, brutalista y vintage.
- app/gestion/: panel y activación.
- app/api/: inventario, solicitudes, imágenes y activación.
- lib/catalog.ts: modelos nuevos de referencia y tipos.
- lib/server.ts y lib/admin-access.ts: datos y autorización.
- db/schema.ts y drizzle/: esquema y migraciones; conservar las ya aplicadas.
- .openai/hosting.json: identidad del sitio existente y bindings; no contiene secretos. Reutilizar el sitio si se continúa publicando con Sites.

Última verificación del código exportado: compilación y TypeScript correctos; pruebas del hash de activación y vinculación única en SQLite. La exportación no añade una comprobación de navegador ni acredita el primer acceso del propietario.
