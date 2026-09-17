import { BadgeCheck } from 'lucide-react';
import { officialBrands, otherBrands } from '@/lib/catalog';

export function BrandStrip() {
  return (
    <section className="brand-groups wrap" aria-label="Marcas">
      <div className="brand-group brand-group-official">
        <h2 className="brand-group-label"><BadgeCheck size={18} aria-hidden="true" /> Servicio técnico oficial</h2>
        <ul>{officialBrands.map(b => <li key={b}>{b}</li>)}</ul>
      </div>
      <div className="brand-group">
        <h2 className="brand-group-label">También trabajamos con</h2>
        <ul>{otherBrands.map(b => <li key={b}>{b}</li>)}<li className="brand-more">y otras marcas</li></ul>
      </div>
    </section>
  );
}
