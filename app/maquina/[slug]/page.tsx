import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowUpRight, ChevronRight, MapPin, Phone, Scale, ShieldCheck, Truck, Wrench } from 'lucide-react';
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
import { RevisionChecklist } from '@/components/site/trust';

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

export default async function MachinePage({ params }: Props) {
  const m = findUsedMachine((await params).slug);
  if (!m) notFound();
  const settings = getSettings();
  const name = title(m);
  const sold = m.disponibilidad === 'vendida';
  const waMachine = whatsappLink(settings, `Hola, vengo de la web y me interesa la ${name} (ref. ${m.slug}).`);
  const facts: [string, string][] = [
    ['Año', m.año ? String(m.año) : 'Sin confirmar'],
    ['Estado', m.estado],
    ...(m.horasUso ? [['Horas de uso', m.horasUso.toLocaleString('es-ES')] as [string, string]] : []),
    ['Ubicación', m.ubicacion],
  ];
  const specs: [string, string | undefined][] = [
    ['Tipo', m.tipo],
    ['Sector', m.categoria],
    ['Capacidad', m.ficha?.capacidad],
    ['Potencia', m.ficha?.potencia],
    ['Alimentación eléctrica', m.ficha?.alimentacion],
    ['Dimensiones', m.ficha?.dimensiones],
  ];

  return (
    <>
      <Header settings={settings} active="catalog" />
      <main id="contenido" className="wrap detail-page used-detail">
        <nav className="breadcrumb" aria-label="Estás aquí">
          <Link href="/#catalogo">Segunda mano</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span>{m.categoria}</span>
          <ChevronRight size={13} aria-hidden="true" />
          <span aria-current="page">{m.marca} {m.modelo}</span>
        </nav>

        {sold && (
          <div className="sold-banner" role="status">
            <strong>Esta máquina ya se ha vendido.</strong>
            <span>Conservamos su ficha como referencia. Si buscas algo parecido, te avisamos cuando entre otra.</span>
            {settings.whatsapp && (
              <a className="btn btn-wa" href={whatsappLink(settings, `Hola, vengo de la web. Vi la ${name} vendida y busco una máquina parecida.`)} target="_blank" rel="noopener">
                <WhatsAppIcon /> Buscadme una parecida
              </a>
            )}
          </div>
        )}

        <div className="detail-grid">
          <section className="gallery" aria-label="Fotografías y vídeo">
            <MachineGallery name={name} photos={m.fotos} />
            <p className="photo-note">Fotografías reales de esta unidad.</p>
          </section>

          <section className="detail-summary" aria-label="Resumen">
            <div className="flex-line">
              <span className="badge badge-used">Segunda mano · Revisada</span>
              <span className={`availability-pill availability-${m.disponibilidad}`}>{availabilityLabel[m.disponibilidad]}</span>
            </div>
            <div className="eyebrow">{m.marca.toUpperCase()} · {m.tipo.toUpperCase()}</div>
            <h1>{m.marca} {m.modelo}</h1>
            {m.descripcion && <p>{m.descripcion}</p>}
            <dl className="quick-facts">
              {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <div className="detail-price">
              <span>{m.precio === 'consultar' ? 'Precio' : 'Precio de la máquina · sin IVA'}</span>
              <strong>{usedPriceLabel(m)}</strong>
              <small>Te presupuestamos el envío a cualquier punto de España y la instalación.</small>
            </div>
            {!sold && (
              <div className="detail-actions">
                {settings.whatsapp && <a className="btn btn-wa-solid full" href={waMachine} target="_blank" rel="noopener"><WhatsAppIcon /> Preguntar por WhatsApp</a>}
                {settings.phone && <a className="btn btn-outline full" href={`tel:${settings.phone}`}><Phone size={17} aria-hidden="true" /> Llamar al {phoneDisplay(settings.phone)}</a>}
                <InquiryButton machines={[toMachine(m)]} settings={settings} className="text-link">Prefiero que me escribáis <ArrowUpRight size={16} aria-hidden="true" /></InquiryButton>
                <a className="text-link" href={`/comparar?ids=${encodeURIComponent(m.slug)}`}><Scale size={16} aria-hidden="true" /> Comparar con una nueva</a>
              </div>
            )}
            <div className="detail-assurance">
              <span><Wrench size={18} aria-hidden="true" /> Revisada en nuestro taller</span>
              <span><ShieldCheck size={18} aria-hidden="true" /> Garantía por escrito</span>
              <span><Truck size={18} aria-hidden="true" /> Envíos a toda España</span>
            </div>
          </section>
        </div>

        {m.video && (
          <section className="machine-video-section" aria-label="Vídeo de la máquina">
            <MachineVideo name={name} video={m.video} />
          </section>
        )}

        <section className="technical" aria-labelledby="estado-titulo">
          <div className="eyebrow">REVISADA EN TALLER</div>
          <h2 id="estado-titulo">Estado, revisión y garantía.</h2>
          <div className="spec-grid">
            <div><span>Revisión en taller</span><p>{m.revision.fecha ? <><strong>{monthLabel(m.revision.fecha)}.</strong> </> : null}{m.revision.resumen}</p></div>
            <div>
              <span>Piezas sustituidas</span>
              {m.piezasSustituidas.length ? <ul className="parts-list">{m.piezasSustituidas.map(p => <li key={p}>{p}</li>)}</ul> : <p>No ha sido necesario sustituir piezas.</p>}
            </div>
            <div><span>Estado general</span><p>{m.estado}</p></div>
            <div><span>Horas de uso</span><p>{m.horasUso ? m.horasUso.toLocaleString('es-ES') + ' horas' : 'No registradas'}</p></div>
            <div><span>Garantía</span><p>{m.garantia}. Por escrito, atendida por nuestro servicio técnico.</p></div>
            <div><span>Disponibilidad y ubicación</span><p><MapPin size={14} aria-hidden="true" /> {availabilityLabel[m.disponibilidad]} · {m.ubicacion}</p></div>
          </div>

          <h2 className="technical-second">Ficha técnica.</h2>
          <div className="spec-grid">
            {specs.map(([k, v]) => <div key={k}><span>{k}</span><p>{v || 'Consúltanos'}</p></div>)}
          </div>
          {settings.whatsapp && (
            <a className="btn btn-outline tech-request" href={whatsappLink(settings, `Hola, vengo de la web y me gustaría recibir la ficha técnica completa de la ${name} (ref. ${m.slug}).`)} target="_blank" rel="noopener">
              <WhatsAppIcon /> Pedir ficha técnica completa
            </a>
          )}
        </section>
      </main>
      <RevisionChecklist compact />
      <Footer settings={settings} />
      <JsonLd data={productSchema(m)} />
    </>
  );
}
