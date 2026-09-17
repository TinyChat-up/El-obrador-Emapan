import { money, type Machine } from './catalog';
import { monthLabel } from './used-machines';

/**
 * Qué se compara y cómo se lee cada valor. Cada fila da un texto corto para
 * una máquina de segunda mano y otro para una nueva, con los mismos nombres.
 */
export type CompareRow = { key: string; label: string; icon: IconName; value: (m: Machine) => string };
export type CompareSection = { id: string; title: string; rows: CompareRow[] };
export type IconName = 'price' | 'truck' | 'stock' | 'badge' | 'calendar' | 'timer' | 'sparkles' | 'wrench' | 'parts' | 'shield' | 'type' | 'layers' | 'gauge' | 'zap' | 'plug' | 'ruler';

const used = (m: Machine) => m.condition === 'Reacondicionada';
const orDash = (v?: string | null) => (v && v.trim() ? v : '—');

export const priceLabel = (m: Machine) => (used(m) ? (m.price === null ? 'Consultar precio' : `${money(m.price)} + IVA`) : 'Bajo propuesta');

export const compareSections: CompareSection[] = [
  {
    id: 'inversion',
    title: 'Precio y entrega',
    rows: [
      { key: 'price', label: 'Precio', icon: 'price', value: priceLabel },
      { key: 'availability', label: 'Disponibilidad', icon: 'stock', value: m => (used(m) ? m.availability : 'Bajo pedido') },
      { key: 'location', label: 'Dónde está', icon: 'truck', value: m => (used(m) ? orDash(m.location) : 'En fábrica, plazo del fabricante') },
      { key: 'shipping', label: 'Envío e instalación', icon: 'truck', value: () => 'A toda España, presupuesto según destino' },
    ],
  },
  {
    id: 'estado',
    title: 'Estado y uso',
    rows: [
      { key: 'condition', label: 'Condición', icon: 'badge', value: m => (used(m) ? 'Segunda mano, revisada en taller' : 'Nueva de fábrica') },
      { key: 'year', label: 'Año de fabricación', icon: 'calendar', value: m => (used(m) ? (m.year ? String(m.year) : 'Sin confirmar') : 'Fabricación actual') },
      { key: 'hours', label: 'Horas de uso', icon: 'timer', value: m => (used(m) ? (m.hours ? `${m.hours.toLocaleString('es-ES')} h` : 'No registradas') : '0 h') },
      { key: 'state', label: 'Estado general', icon: 'sparkles', value: m => (used(m) ? orDash(m.state) : 'A estrenar') },
    ],
  },
  {
    id: 'garantia',
    title: 'Revisión y garantía',
    rows: [
      { key: 'review', label: 'Revisión técnica', icon: 'wrench', value: m => (used(m) ? [monthLabel(m.reviewDate), m.inspection].filter(Boolean).join(' · ') : 'No necesaria: máquina nueva') },
      { key: 'parts', label: 'Piezas sustituidas', icon: 'parts', value: m => (used(m) ? (m.parts?.length ? m.parts.join(', ') : 'Ninguna necesaria') : '—') },
      { key: 'warranty', label: 'Garantía', icon: 'shield', value: m => (used(m) ? `${m.warranty}, por escrito` : 'Del fabricante, según propuesta') },
    ],
  },
  {
    id: 'ficha',
    title: 'Ficha técnica',
    rows: [
      { key: 'type', label: 'Tipo de máquina', icon: 'type', value: m => m.type },
      { key: 'category', label: 'Sector', icon: 'layers', value: m => m.category },
      { key: 'capacity', label: 'Capacidad', icon: 'gauge', value: m => orDash(m.capacity) },
      { key: 'power', label: 'Potencia', icon: 'zap', value: m => orDash(m.power) },
      { key: 'voltage', label: 'Alimentación eléctrica', icon: 'plug', value: m => orDash(m.voltage) },
      { key: 'dimensions', label: 'Dimensiones', icon: 'ruler', value: m => orDash(m.dimensions) },
    ],
  },
];

/** El modelo nuevo que mejor se corresponde con una máquina usada. */
export function bestNewMatch(m: Machine, models: Machine[], exclude: string[] = []) {
  const pool = models.filter(x => !exclude.includes(x.id));
  // «Horno de carro rotativo» y «Horno mixto» son de la misma familia.
  const family = (x: Machine) => x.type.split(' ')[0].toLowerCase();
  return (
    pool.find(x => x.id === m.comparisonKey) ||
    pool.find(x => family(x) === family(m) && x.brand === m.brand) ||
    pool.find(x => family(x) === family(m)) ||
    pool.find(x => x.brand === m.brand && x.category === m.category) ||
    pool.find(x => x.category === m.category) ||
    pool[0]
  );
}

/**
 * Máquinas que aparecen al abrir el comparador. Respeta las de la URL y
 * completa las columnas: primero segunda mano, después su mejor alternativa nueva.
 */
export function initialSelection(usedMachines: Machine[], models: Machine[], requested: string[], columns = 3) {
  const all = [...usedMachines, ...models];
  const ids = [...new Set(requested)].filter(id => all.some(m => m.id === id)).slice(0, columns);
  if (!ids.length) {
    const first = usedMachines[0] ?? models[0];
    if (first) ids.push(first.id);
  }
  while (ids.length < columns) {
    const anchor = all.find(m => m.id === ids[0]);
    // La tercera columna puede ser otra usada del mismo sector; si no la hay, otra nueva parecida.
    const sameSectorUsed = anchor && ids.length === 2 ? usedMachines.find(m => !ids.includes(m.id) && m.category === anchor.category) : undefined;
    const pick = sameSectorUsed ?? (anchor ? bestNewMatch(anchor, models, ids) : undefined);
    if (!pick) break;
    ids.push(pick.id);
  }
  return ids;
}
