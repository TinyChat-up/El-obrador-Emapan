# El Obrador de Emapan

Web de Emapan S.L.: maquinaria de segunda mano revisada en taller, modelos
nuevos bajo propuesta y servicio técnico. Next.js en Vercel.
**Todo el contenido se gestiona desde el código**: no hay panel ni base de datos.

## Dónde se cambia cada cosa

| Qué quieres hacer | Dónde |
| --- | --- |
| Publicar, editar, reservar o marcar como vendida una máquina usada | [`lib/used-machines.ts`](lib/used-machines.ts) |
| Fotos y vídeos de las máquinas usadas | `public/maquinas/<nombre-de-la-maquina>/` |
| Datos de la empresa (CIF, dirección, teléfono, horario, cobertura…) | [`lib/catalog.ts`](lib/catalog.ts), constante `settings` |
| Garantía (texto de portada) | [`lib/catalog.ts`](lib/catalog.ts), `warranty` |
| Foto del taller de la portada | [`lib/catalog.ts`](lib/catalog.ts), `workshopPhoto` |
| Marcas de «Servicio técnico de» | [`lib/catalog.ts`](lib/catalog.ts), `serviceBrands` |
| Modelos nuevos bajo propuesta | [`lib/catalog.ts`](lib/catalog.ts), lista `demos` |
| Lista «Antes de venderla, la revisamos a fondo» | [`components/site/review.tsx`](components/site/review.tsx) |

Editas, `git push`, y Vercel publica solo. Busca `[PENDIENTE` en el proyecto
para ver los datos que faltan: se muestran tal cual en la web hasta que los
sustituyas.

## Añadir una máquina de segunda mano

1. **Fotos.** Crea una carpeta en `public/maquinas/`, por ejemplo
   `public/maquinas/carpigiani-labotronic-2019/`, y guarda dentro las fotos
   (JPG, PNG o WebP). No hace falta reducirlas: la web las optimiza sola. Si
   tienes vídeo, un `.mp4` corto en la misma carpeta o un enlace de YouTube.
2. **Datos.** Abre [`lib/used-machines.ts`](lib/used-machines.ts), copia la
   PLANTILLA comentada dentro de la lista `usedMachines` (quitando las `//`) y
   rellena los campos. Pon las máquinas nuevas **arriba**: el catálogo las
   muestra en ese orden.
3. **Publica.** Guarda, `git add -A`, `git commit -m "Añadir Labotronic 2019"`
   y `git push`. En un par de minutos estará en
   `/maquina/carpigiani-labotronic-2019`.

- `disponibilidad: 'reservada'` la deja visible con la etiqueta «Reservada».
- `disponibilidad: 'vendida'` la quita del catálogo, pero su ficha sigue
  accesible con el aviso de vendida.
- `publicada: false` la oculta del todo sin borrarla.
- `precio: 'consultar'` muestra «Consultar precio». Un número se muestra sin IVA.
- La dirección se forma con marca, modelo y año. Si dos máquinas coinciden, el
  build falla con un aviso claro: añade `slug: 'otro-nombre'` a una de ellas.

Mientras la lista esté vacía, la portada muestra el aviso «Las primeras
unidades están en camino» y los modelos nuevos.

## Imágenes

- **Fotos de fabricantes (necesitan autorización de uso).** Todas las de los
  modelos nuevos de `public/images/`: `mondial-domino.png`, `mondial-techno.png`,
  `mondial-slim.png`, `carpigiani-labotronic-full.jpg`,
  `carpigiani-pastomaster.jpg`, `roboqbo-qbo15.jpg`, `roboqbo-interior.jpg`,
  `labus-abv.jpg`, `fm-stb606.png`, `wiesheu-dibas.png` e `ifi-esedra.jpg`.
  Proceden de las webs de los fabricantes o de sus distribuidores (detalle en
  [SOURCES.md](SOURCES.md)). No se encontró licencia de reutilización: pide
  permiso por escrito a cada marca o sustitúyelas por fotos propias. Las de Carpigiani vienen de un distribuidor
  alemán y son las primeras que conviene cambiar.
- **Históricas, de dominio público:** `bread-poster-1918.jpg` y
  `bakery-interior-1900.jpg` ([VINTAGE-SOURCES.md](VINTAGE-SOURCES.md)).
- **Propias:** `emapan-logo.png` y todo lo que haya en `public/maquinas/`.

Todas las imágenes se sirven con `next/image`: AVIF o WebP según el navegador,
tamaños adaptados a cada pantalla y carga diferida (salvo la foto principal).

## Comparador

`/comparar` pone hasta tres máquinas lado a lado (dos en el móvil), al estilo
de la comparativa de móviles de Apple: cada columna tiene su selector y debajo
se alinean precio, estado, revisión, garantía y ficha técnica.

- Las filas y sus textos están en [`lib/compare.ts`](lib/compare.ts).
- Al abrirlo desde una máquina usada, la segunda columna elige el modelo nuevo
  indicado en `compararCon`; si no hay, uno de la misma marca y sector.
- La dirección se puede compartir: `/comparar?ids=maquina-1,demo-domino`.

## Estructura de la portada

Una sola historia, de arriba abajo: quiénes somos (con el cartel de 1918) →
marcas de las que hacemos servicio técnico → ¿qué necesitas? (comprar, reparar,
vender) → segunda mano frente a nueva (acceso al comparador) → maquinaria de
segunda mano → maquinaria nueva → el oficio (foto
histórica) → cómo revisamos (foto del taller) → contacto. Los estilos están
en [`app/site.css`](app/site.css).

## Dominio propio

Ver [DESPLIEGUE.md](DESPLIEGUE.md#dominio-propio). La dirección pública se
configura con la variable `NEXT_PUBLIC_SITE_URL`; no hay ninguna dirección de
vercel.app escrita en el código.

## Analítica

Usa Vercel Web Analytics, que no instala cookies y por eso no necesita aviso de
cookies. Se activa en Vercel → proyecto → **Analytics** → Enable. Si algún día
se añade una herramienta que use cookies (Google Analytics, Meta Pixel…), hará
falta un banner de consentimiento y actualizar `/privacidad`.

## Publicación

Consulta [DESPLIEGUE.md](DESPLIEGUE.md). Comandos: `pnpm install
--frozen-lockfile` y `pnpm build`.

Los archivos de Cloudflare/Vinext y los documentos de exportación
(`EMPEZAR-CON-CODEX.md`, `OPERATIONS.md`, `EXPORTACION.json`) son antecedentes
históricos; no describen el despliegue actual.
