import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { phoneDisplay } from '@/lib/catalog';
import { getSettings } from '@/lib/server';
import { absoluteUrl, whatsappLink } from '@/lib/site';
import { allUsedMachines, availabilityLabel, findUsedMachine, toMachine, usedPriceLabel, type UsedMachine } from '@/lib/used-machines';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import { WhatsAppIcon } from '@/components/site/icons';
import { JsonLd } from '@/components/site/json-ld';
import { InquiryButton } from '@/components/site/inquiry-dialog';
import { MachineGallery, MachineVideo } from '@/components/site/machine-gallery';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allUsedMachines().map(m => ({ slug: m.slug }));
}

const title = (m: UsedMachine) => `${m.marca} ${m.modelo}${m.año ? ` (${m.año})` : ''}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = findUsedMachine((await params).slug);
  if (!m) return { title: 'Máquina no encontrada', robots: { index: false } };
  const price = m.precio === 'consultar' ? '' : ` Precio: ${usedPriceLabel(m)} + IVA.`;
  return {
    title: `${title(m)} de segunda mano · ${m.tipo}`,
    description: `${m.tipo} ${m.marca} ${m.modelo} de segunda mano${m.año ? ` del ${m.año}` : ''}, revisada en el taller de Emapan y con garantía por escrito.${price} ${availabilityLabel[m.disponibilidad]}. Envíos a toda España.`.slice(0, 300),
    alternates: { canonical: `/maquina/${m.slug}` },
    openGraph: { type: 'website', title: `${title(m)} de segunda mano`, images: m.fotos.slice(0, 1).map(f => ({ url: f.src, alt: f.alt })) },
  };
}

function monthLabel(value?: string) {
  if (!value) return '';
  const [y, mo] = value.split('-').map(Number);
  if (!y) return value;
  if (!mo) return String(y);
  return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date(y, mo - 1, 1));
}

function productSchema(m: UsedMachine) {
  const availability = { disponible: 'InStock', reservada: 'Reserved', vendida: 'SoldOut' }[m.disponibilidad];
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${m.marca} ${m.modelo}`,
    description: m.descripcion || `${m.tipo} de segunda mano revisada en taller.`,
    brand: { '@type': 'Brand', name: m.marca },
    model: m.modelo,
    category: `${m.categoria} > ${m.tipo}`,
    sku: m.slug,
    ...(m.año ? { productionDate: String(m.año) } : {}),
    image: m.fotos.map(f => absoluteUrl(f.src)),
    url: absoluteUrl(`/maquina/${m.slug}`),
    itemCondition: 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/maquina/${m.slug}`),
      availability: `https://schema.org/${availability}`,
      itemCondition: 'https://schema.org/UsedCondition',
      ...(m.precio === 'consultar'
        ? {}
        : { price: m.precio, priceCurrency: 'EUR', priceSpecification: { '@type': 'UnitPriceSpecification', price: m.precio, priceCurrency: 'EUR', valueAddedTaxIncluded: false } }),
      seller: { '@id': absoluteUrl('/#empresa') },
    },
  };
}

function Facts({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="facts">
      {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
    </dl>
  );
}

export default async function MachinePage({ params }: Props) {
  const m = findUsedMachine((await params).slug);
  if (!m) notFound();
  const settings = getSettings();
  const name = title(m);
  const sold = m.disponibilidad === 'vendida';

  const condition: [string, React.ReactNode][] = [
    ['Estado', m.estado],
    ...(m.horasUso ? [['Horas de uso', `${m.horasUso.toLocaleString('es-ES')} h`] as [string, string]] : []),
    ['Revisión en taller', <>{m.revision.fecha && <>{monthLabel(m.revision.fecha)}. </>}{m.revision.resumen}</>],
    ['Piezas sustituidas', m.piezasSustituidas.length ? m.piezasSustituidas.join(', ') : 'Ninguna necesaria'],
    ['Garantía', `${m.garantia}, por escrito`],
    ['Ubicación', m.ubicacion],
  ];
  const specs = ([
    ['Tipo', m.tipo],
    ['Capacidad', m.ficha?.capacidad],
    ['Potencia', m.ficha?.potencia],
    ['Alimentación eléctrica', m.ficha?.alimentacion],
    ['Dimensiones', m.ficha?.dimensiones],
  ] as [string, string | undefined][]).filter((r): r is [string, string] => !!r[1]);

  return (
    <>
      <Header settings={settings} active="machines" />
      <main id="contenido" className="used-page wrap">
        <Link className="back" href="/#maquinaria"><ArrowLeft size={15} aria-hidden="true" /> Maquinaria</Link>

        <div className="used-grid">
          <section aria-label="Fotografías">
            <MachineGallery name={name} photos={m.fotos} />
          </section>

          <section className="used-summary" aria-label="Resumen">
            <p className="tile-meta">
              Segunda mano · Revisada en taller
              <span className={`availability availability-${m.disponibilidad}`}>{availabilityLabel[m.disponibilidad]}</span>
            </p>
            <h1>{m.marca} {m.modelo}</h1>
            <p className="used-sub">{m.tipo}{m.año ? ` · ${m.año}` : ''}</p>
            {m.descripcion && <p className="used-desc">{m.descripcion}</p>}
            <p className="used-price">
              {usedPriceLabel(m)}
              {m.precio !== 'consultar' && <small> + IVA</small>}
            </p>

            {sold ? (
              <div className="sold-note" role="status">
                <p><strong>Esta máquina ya está vendida.</strong> Si buscas algo parecido, te avisamos cuando entre otra.</p>
                {settings.whatsapp && <a className="btn btn-wa-solid" href={whatsappLink(settings, `Hola, vengo de la web. Busco una máquina parecida a la ${name}.`)} target="_blank" rel="noopener"><WhatsAppIcon /> Buscadme una parecida</a>}
              </div>
            ) : (
              <>
                <div className="actions actions-stack">
                  {settings.whatsapp && <a className="btn btn-wa-solid" href={whatsappLink(settings, `Hola, vengo de la web y me interesa la ${name} (ref. ${m.slug}).`)} target="_blank" rel="noopener"><WhatsAppIcon /> Preguntar por WhatsApp</a>}
                  {settings.phone && <a className="btn btn-outline" href={`tel:${settings.phone}`}>Llamar al {phoneDisplay(settings.phone)}</a>}
                </div>
                <p className="used-links">
                  <InquiryButton machines={[toMachine(m)]} settings={settings} className="link-button">Prefiero dejar mis datos</InquiryButton>
                  <span aria-hidden="true"> · </span>
                  <Link href={`/comparar?ids=${encodeURIComponent(m.slug)}`}>Comparar con una nueva</Link>
                </p>
              </>
            )}
            <p className="used-shipping">Envío a toda España. Te presupuestamos transporte e instalación.</p>
          </section>
        </div>

        {m.video && (
          <section className="used-block" aria-label="Vídeo">
            <MachineVideo name={name} video={m.video} />
          </section>
        )}

        <div className="used-details">
          <section className="used-block" aria-labelledby="estado-titulo">
            <h2 id="estado-titulo">Estado y revisión</h2>
            <Facts rows={condition} />
          </section>
          <section className="used-block" aria-labelledby="ficha-titulo">
            <h2 id="ficha-titulo">Ficha técnica</h2>
            <Facts rows={specs} />
            {settings.whatsapp && (
              <a className="text-link" href={whatsappLink(settings, `Hola, vengo de la web. ¿Me enviáis la ficha técnica completa de la ${name} (ref. ${m.slug})?`)} target="_blank" rel="noopener">
                Pedir la ficha técnica completa
              </a>
            )}
          </section>
        </div>
      </main>
      <Footer settings={settings} />
      <JsonLd data={productSchema(m)} />
    </>
  );
}
