import { blankMachine, normalizeComparisonKey, type Machine } from './catalog';

// ─────────────────────────────────────────────────────────────────────────
//  MÁQUINAS DE SEGUNDA MANO
//
//  Este es el único archivo que hay que tocar para publicar una máquina
//  usada. Paso a paso en el README («Añadir una máquina de segunda mano»).
//
//  1. Crea la carpeta public/maquinas/<nombre-de-la-maquina>/ y mete dentro
//     las fotos (JPG, PNG o WebP; la primera será la principal).
//  2. Copia la PLANTILLA de abajo dentro de la lista `usedMachines`, quita
//     las barras // del principio de cada línea y cambia los datos.
//  3. Guarda, haz commit y push. Vercel publica la ficha en
//     /maquina/<slug>, por ejemplo /maquina/carpigiani-labotronic-2019.
//
//  PLANTILLA (desactivada, lista para copiar):
//
//  {
//    marca: 'Carpigiani',
//    modelo: 'Labotronic 20/60 RTX',
//    tipo: 'Mantecadora vertical',
//    categoria: 'Heladería',            // Panadería | Pastelería | Heladería | Hostelería
//    año: 2019,                         // o null si no se conoce
//    estado: 'Muy buen estado',         // Como nueva | Muy buen estado | Buen estado | Con marcas de uso
//    horasUso: 3200,                    // opcional: bórralo si no se conoce
//    revision: {
//      fecha: '2026-09',                // año-mes de la revisión en taller
//      resumen: 'Revisión completa en taller: circuito de frío, carga de gas, batidor y cuadro eléctrico.',
//    },
//    piezasSustituidas: ['Juntas de la puerta', 'Correa de transmisión', 'Rascadores del batidor'],
//    garantia: '6 meses en piezas y mano de obra',
//    precio: 'consultar',               // un número sin IVA (p. ej. 12500) o 'consultar'
//    ubicacion: 'Taller de Emapan, Elda (Alicante)',
//    disponibilidad: 'disponible',      // disponible | reservada | vendida
//    fotos: [
//      { archivo: 'carpigiani-labotronic-2019/frontal.jpg', alt: 'Carpigiani Labotronic de segunda mano, vista frontal' },
//      { archivo: 'carpigiani-labotronic-2019/batidor.jpg', alt: 'Batidor de la Carpigiani Labotronic tras la revisión' },
//    ],
//    video: '',                         // opcional: 'carpigiani-labotronic-2019/prueba.mp4' o un enlace de YouTube
//    descripcion: 'Mantecadora vertical para heladería artesana.',
//    ficha: {                           // opcional: datos técnicos que conozcas
//      capacidad: '20 litros de mezcla por ciclo',
//      potencia: '',
//      alimentacion: '400 V trifásica',
//      dimensiones: '',
//    },
//    compararCon: 'demo-labotronic',   // opcional: modelo nuevo para el comparador
//    // slug: 'carpigiani-labotronic-2019', // opcional: si no, se forma con marca, modelo y año
//    // publicada: false,                   // para ocultarla sin borrarla
//  },
// ─────────────────────────────────────────────────────────────────────────

export const usedMachines: UsedMachineInput[] = [
  // Todavía no hay ninguna máquina publicada. Copia aquí la plantilla.
];

// ─────────────────────────────────────────────────────────────────────────
// A partir de aquí no hace falta tocar nada.

export type Availability = 'disponible' | 'reservada' | 'vendida';
export type UsedCategory = 'Panadería' | 'Pastelería' | 'Heladería' | 'Hostelería';

export type UsedMachineInput = {
  marca: string;
  modelo: string;
  tipo: string;
  categoria: UsedCategory;
  año: number | null;
  estado: string;
  horasUso?: number;
  revision: { fecha?: string; resumen: string };
  piezasSustituidas: string[];
  garantia: string;
  precio: number | 'consultar';
  ubicacion: string;
  disponibilidad: Availability;
  /** Rutas dentro de public/maquinas/. La primera es la foto principal. */
  fotos: { archivo: string; alt?: string }[];
  /** Archivo dentro de public/maquinas/ o enlace de YouTube. */
  video?: string;
  descripcion?: string;
  ficha?: { capacidad?: string; potencia?: string; alimentacion?: string; dimensiones?: string };
  compararCon?: string;
  slug?: string;
  publicada?: boolean;
};

export type UsedMachine = Omit<UsedMachineInput, 'fotos' | 'video'> & {
  slug: string;
  fotos: { src: string; alt: string }[];
  video?: { kind: 'file'; src: string } | { kind: 'youtube'; id: string };
};

export const availabilityLabel: Record<Availability, string> = {
  disponible: 'Disponible',
  reservada: 'Reservada',
  vendida: 'Vendida',
};

function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m?.[1];
}

function normalize(input: UsedMachineInput): UsedMachine {
  const name = `${input.marca} ${input.modelo}`;
  const slug = normalizeComparisonKey(input.slug || [input.marca, input.modelo, input.año ?? ''].join(' '));
  const src = (file: string) => (file.startsWith('/') ? file : '/maquinas/' + file.replace(/^\/+/, ''));
  let video: UsedMachine['video'];
  if (input.video) {
    const id = youtubeId(input.video);
    if (id) video = { kind: 'youtube', id };
    else if (/^https?:/.test(input.video)) throw new Error(`Máquina ${slug}: el vídeo debe ser un archivo de public/maquinas/ o un enlace de YouTube`);
    else video = { kind: 'file', src: src(input.video) };
  }
  return {
    ...input,
    slug,
    fotos: input.fotos.map((f, i) => ({
      src: src(f.archivo),
      alt: f.alt?.trim() || `${name} de segunda mano${input.año ? ` (${input.año})` : ''}, foto ${i + 1}`,
    })),
    video,
  };
}

const all = usedMachines.filter(m => m.publicada !== false).map(normalize);
const seen = new Set<string>();
for (const m of all) {
  if (seen.has(m.slug)) throw new Error(`Hay dos máquinas con la dirección /maquina/${m.slug}. Añade un «slug» distinto a una de ellas.`);
  seen.add(m.slug);
}

/** Todas las publicadas, incluidas las vendidas (conservan su ficha). */
export function allUsedMachines() {
  return all;
}

/** Las que aparecen en el catálogo y el comparador: disponibles y reservadas. */
export function listedUsedMachines() {
  return all.filter(m => m.disponibilidad !== 'vendida');
}

export function findUsedMachine(slug: string) {
  return all.find(m => m.slug === slug);
}

/** '2026-09' → 'septiembre de 2026'. */
export function monthLabel(value?: string) {
  if (!value) return '';
  const [y, mo] = value.split('-').map(Number);
  if (!y) return value;
  if (!mo) return String(y);
  return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date(y, mo - 1, 1));
}

export const usedPriceLabel = (m: UsedMachine) =>
  m.precio === 'consultar'
    ? 'Consultar precio'
    : new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(m.precio);

/** Adaptación al formato del catálogo y el comparador. */
export function toMachine(m: UsedMachine): Machine {
  const parts = m.piezasSustituidas.length ? `Piezas sustituidas: ${m.piezasSustituidas.join(', ')}.` : '';
  return {
    ...blankMachine,
    id: m.slug,
    brand: m.marca,
    model: m.modelo,
    comparisonKey: m.compararCon || '',
    type: m.tipo,
    category: m.categoria,
    condition: 'Reacondicionada',
    description: m.descripcion || `${m.tipo} ${m.marca} ${m.modelo} de segunda mano, revisada en nuestro taller.`,
    functioning: m.estado,
    images: m.fotos.map((f, i) => ({ url: f.src, label: f.alt, kind: i === 0 ? 'exterior' : 'detail' })),
    year: m.año,
    price: m.precio === 'consultar' ? null : m.precio,
    capacity: m.ficha?.capacidad || '',
    power: m.ficha?.potencia || '',
    dimensions: m.ficha?.dimensiones || '',
    voltage: m.ficha?.alimentacion || '',
    warranty: m.garantia,
    leadTime: 'Envío a toda España, plazo según destino',
    inspection: m.revision.resumen,
    workDone: parts,
    defects: m.estado,
    life: m.horasUso ? `${m.horasUso.toLocaleString('es-ES')} horas de uso` : 'Horas de uso no registradas',
    availability: availabilityLabel[m.disponibilidad],
    isDemo: false,
    published: true,
    hours: m.horasUso ?? null,
    parts: m.piezasSustituidas,
    reviewDate: m.revision.fecha,
    state: m.estado,
    location: m.ubicacion,
  };
}
