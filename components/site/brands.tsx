import { serviceBrands } from '@/lib/catalog';

/** Las marcas de las que hacemos servicio técnico, en una sola línea. */
export function BrandsLine() {
  return (
    <section className="brands-line" aria-labelledby="marcas-titulo">
      <div className="wrap">
        <h2 id="marcas-titulo">Servicio técnico de</h2>
        <ul>{serviceBrands.map(b => <li key={b}>{b}</li>)}</ul>
      </div>
    </section>
  );
}
