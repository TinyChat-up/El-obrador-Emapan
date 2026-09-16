import { blankMachine, type Machine } from './catalog';

// ─────────────────────────────────────────────────────────────────────────
//  TUS MÁQUINAS DE SEGUNDA MANO
//
//  Este es el único archivo que necesitas tocar para gestionar el catálogo.
//  Añade un bloque por máquina, guarda, haz commit y push: Vercel publica
//  solo. Para retirar una, borra su bloque o pon published:false.
//
//  Las fotografías se guardan en public/images/ y se nombran aquí sin ruta:
//  'amasadora-2018.jpg' busca public/images/amasadora-2018.jpg.
//
//  Ejemplo completo, listo para copiar:
//
//  maquina({
//   id:'amasadora-espiral-2018',            // único, sin espacios ni acentos
//   brand:'Mondial Forni',                  // marca, cualquiera
//   model:'IM 80',
//   type:'Amasadora de espiral',
//   category:'Panadería',                   // Panadería|Heladería|Pastelería|Hostelería
//   year:2018,
//   price:6500,                             // null = «A presupuestar»
//   description:'Amasadora de espiral de 80 kg de masa, cuba fija.',
//   functioning:'Motor de dos velocidades, temporizador y parada de seguridad.',
//   capacity:'80 kg de masa por amasado',
//   power:'4 kW',
//   dimensions:'900 × 1500 × 1400 mm',
//   voltage:'400 V trifásico',
//   warranty:'6 meses en piezas y mano de obra',
//   leadTime:'Entrega en 2 semanas',
//   inspection:'Revisada en taller en enero de 2026',
//   workDone:'Cambio de correas y revisión del cuadro eléctrico.',
//   defects:'Marcas de uso en la carcasa. No afectan al funcionamiento.',
//   life:'Uso estimado de 8 a 10 años con mantenimiento anual.',
//   availability:'Disponible',              // Disponible|Reservada|Vendida|Retirada
//   comparisonKey:'demo-domino',            // opcional: id del modelo nuevo a comparar
//   fotos:['amasadora-2018.jpg','amasadora-2018-detalle.jpg'],
//  }),
// ─────────────────────────────────────────────────────────────────────────

export const stock: Machine[] = [
  // Todavía no hay ninguna máquina publicada. Copia el ejemplo de arriba.
];

// ─────────────────────────────────────────────────────────────────────────
// A partir de aquí no hace falta tocar nada.

type Entrada = Partial<Omit<Machine, 'images' | 'condition' | 'isDemo'>> & {
  id: string;
  brand: string;
  model: string;
  /** Nombres de archivo dentro de public/images/, la primera es la principal. */
  fotos?: string[];
};

export function maquina({ fotos = [], ...campos }: Entrada): Machine {
  return {
    ...blankMachine,
    condition: 'Reacondicionada',
    availability: 'Disponible',
    published: true,
    isDemo: false,
    ...campos,
    images: fotos.map((nombre, i) => ({
      url: nombre.startsWith('/') ? nombre : '/images/' + nombre,
      label: i === 0 ? 'Vista general' : `Detalle ${i}`,
      kind: i === 0 ? 'exterior' : 'detail',
    })),
  };
}
