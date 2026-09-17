import { BadgeCheck, Building2, CalendarDays, ShieldCheck, Wrench } from 'lucide-react';
import { officialBrands, warrantyIncludes, type Settings } from '@/lib/catalog';

/** Lista del proceso de revisión en taller. Revísala con el equipo técnico si cambia el procedimiento. */
export const revisionSteps = [
  ['Identificación', 'Placa de características, número de serie y año. Comprobamos que la máquina es la que se anuncia.'],
  ['Instalación eléctrica', 'Cuadro, cableado, conexiones, protecciones y toma de tierra.'],
  ['Motores y transmisión', 'Motores, reductoras, correas y rodamientos. Buscamos holguras, vibraciones y ruidos anómalos.'],
  ['Frío y calor', 'Según la máquina: compresor y circuito de frío, resistencias, quemadores, termostatos y sondas.'],
  ['Electrónica y mandos', 'Placas, pantallas, programas y alarmas.'],
  ['Seguridades', 'Microinterruptores de puertas y tapas, rejillas de protección y paradas de emergencia.'],
  ['Piezas de desgaste', 'Juntas, rascadores, cuchillas y gomas. Sustituimos las que lo necesitan.'],
  ['Limpieza e higiene', 'Limpieza a fondo de las partes en contacto con el alimento.'],
  ['Prueba de funcionamiento', 'Ciclos completos de trabajo en el taller antes de darla por buena.'],
  ['Documentación y garantía', 'Anotamos la revisión y las piezas sustituidas. La máquina sale con garantía por escrito.'],
] as const;

export function TrustSection({ settings }: { settings: Settings }) {
  const years = new Date().getFullYear() - settings.foundedYear;
  return (
    <section className="trust wrap" aria-labelledby="confianza-titulo">
      <div className="section-title">
        <div>
          <div className="eyebrow">POR QUÉ EMAPAN</div>
          <h2 id="confianza-titulo">Detrás de cada máquina, un servicio técnico.</h2>
        </div>
      </div>
      <div className="trust-grid">
        <article>
          <CalendarDays aria-hidden="true" />
          <strong className="trust-figure">Desde {settings.foundedYear}</strong>
          <h3>Empresa familiar con oficio</h3>
          <p>Más de {years} años reparando y manteniendo maquinaria de panadería, pastelería y heladería.</p>
        </article>
        <article>
          <BadgeCheck aria-hidden="true" />
          <strong className="trust-figure">Oficial</strong>
          <h3>Servicio técnico oficial</h3>
          <p>De {officialBrands.slice(0, -1).join(', ')} y {officialBrands.at(-1)}.</p>
        </article>
        <article>
          <Building2 aria-hidden="true" />
          <strong className="trust-figure">Grandes cuentas</strong>
          <h3>Cadenas y organismos públicos</h3>
          <p>Mantenemos equipos de grandes cadenas de supermercados y de organismos públicos.</p>
        </article>
        <article>
          <Wrench aria-hidden="true" />
          <strong className="trust-figure">Taller propio</strong>
          <h3>En {settings.locality} ({settings.region})</h3>
          <p>Cada máquina usada se revisa y se prueba en nuestro taller antes de venderse. Enviamos a toda España.</p>
        </article>
      </div>
      <div className="warranty-panel">
        <div>
          <ShieldCheck size={28} aria-hidden="true" />
          <h3>Qué incluye la garantía</h3>
        </div>
        <ul>{warrantyIncludes.map(w => <li key={w}>{w}</li>)}</ul>
      </div>
    </section>
  );
}

export function RevisionChecklist({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`revision wrap ${compact ? 'revision-compact' : ''}`} aria-labelledby="revision-titulo">
      <div className="revision-intro">
        <div className="eyebrow">ANTES DE VENDERLA</div>
        <h2 id="revision-titulo">Qué revisamos antes de vender una máquina.</h2>
        <p>Ninguna máquina de segunda mano sale de nuestro taller sin pasar por este proceso. Lo hace el mismo equipo que presta el servicio técnico oficial.</p>
      </div>
      <ol className="revision-list">
        {revisionSteps.map(([title, text], i) => (
          <li key={title}>
            <span className="revision-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3>{title}</h3>
              {!compact && <p>{text}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
