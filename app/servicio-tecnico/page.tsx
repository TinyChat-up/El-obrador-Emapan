import type { Metadata } from 'next';
import { phoneDisplay, serviceBrands } from '@/lib/catalog';
import { getSettings } from '@/lib/server';
import { absoluteUrl, whatsappLink } from '@/lib/site';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import { BrandsLine } from '@/components/site/brands';
import { WhatsAppIcon } from '@/components/site/icons';
import { JsonLd } from '@/components/site/json-ld';

export const metadata: Metadata = {
  title: 'Servicio técnico de maquinaria de panadería y heladería en Alicante',
  description: `Reparación y mantenimiento de maquinaria de panadería, pastelería y heladería: ${serviceBrands.join(', ')}. Contratos de mantenimiento anual para obradores y cadenas.`,
  alternates: { canonical: '/servicio-tecnico' },
};

const services = [
  ['Reparación', 'Diagnóstico y reparación de hornos, amasadoras, mantecadoras, pasteurizadores, vitrinas y otros equipos, en tu obrador o en nuestro taller.'],
  ['Mantenimiento preventivo', 'Revisiones periódicas para evitar averías y paradas en plena producción.'],
  ['Contrato de mantenimiento anual', 'Para obradores, heladerías y cadenas con varios establecimientos. Lo presupuestamos según tus equipos y dónde estén.'],
] as const;

export default function ServicePage() {
  const s = getSettings();
  const wa = whatsappLink(s, 'Hola, vengo de la web y necesito servicio técnico para una máquina.');
  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Servicio técnico de maquinaria de panadería, pastelería y heladería',
    brand: serviceBrands.map(name => ({ '@type': 'Brand', name })),
    provider: { '@id': absoluteUrl('/#empresa') },
    url: absoluteUrl('/servicio-tecnico'),
  };

  return (
    <>
      <Header settings={s} active="service" />
      <main id="contenido">
        <section className="intro intro-single wrap">
          <div className="intro-copy">
            <p className="kicker">{s.locality} ({s.region}) · Desde {s.foundedYear}</p>
            <h1>Servicio técnico para tu maquinaria de obrador.</h1>
            <p className="lead">
              Reparamos y mantenemos maquinaria de panadería, pastelería y heladería. Somos una empresa familiar y trabajamos para obradores, grandes cadenas de supermercados y organismos públicos.
            </p>
            <div className="actions">
              {s.whatsapp && <a className="btn btn-wa-solid" href={wa} target="_blank" rel="noopener"><WhatsAppIcon /> Pedir asistencia</a>}
              {s.phone && <a className="btn btn-outline" href={`tel:${s.phone}`}>Llamar al {phoneDisplay(s.phone)}</a>}
            </div>
          </div>
        </section>

        <BrandsLine />

        <section className="doors wrap" aria-labelledby="hacemos-titulo">
          <h2 id="hacemos-titulo">Qué hacemos</h2>
          <ul>
            {services.map(([t, d], i) => (
              <li key={t}>
                <div>
                  <span className="door-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="doors-note">¿Tu marca no está en la lista? Pregúntanos igualmente.</p>
        </section>

        <section className="contact-block" aria-labelledby="contacto-titulo">
          <div className="wrap">
            <h2 id="contacto-titulo">¿Tienes una máquina parada?</h2>
            <p>Cuéntanos marca, modelo y qué le pasa. Mejor aún con una foto por WhatsApp.</p>
            <div className="actions">
              {s.whatsapp && <a className="btn btn-wa-solid" href={wa} target="_blank" rel="noopener"><WhatsAppIcon /> WhatsApp</a>}
              {s.phone && <a className="btn btn-outline" href={`tel:${s.phone}`}>Llamar al {phoneDisplay(s.phone)}</a>}
            </div>
            <dl className="facts facts-center">
              <div><dt>Zona de servicio</dt><dd>{s.coverage}</dd></div>
              <div><dt>Horario</dt><dd>{s.openingHours}</dd></div>
              <div><dt>Taller</dt><dd>{s.address}</dd></div>
              {s.email && <div><dt>Correo</dt><dd><a href={`mailto:${s.email}`}>{s.email}</a></dd></div>}
            </dl>
          </div>
        </section>
      </main>
      <Footer settings={s} />
      <JsonLd data={service} />
    </>
  );
}
