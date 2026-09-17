import type { Metadata } from 'next';
import { BadgeCheck, CalendarCheck, Clock, FileSignature, Mail, MapPin, Phone, Wrench } from 'lucide-react';
import { officialBrands, otherBrands, phoneDisplay } from '@/lib/catalog';
import { getSettings } from '@/lib/server';
import { absoluteUrl, whatsappLink } from '@/lib/site';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import { WhatsAppIcon } from '@/components/site/icons';
import { JsonLd } from '@/components/site/json-ld';

export const metadata: Metadata = {
  title: 'Servicio técnico oficial de maquinaria de panadería y heladería en Alicante',
  description:
    'Servicio técnico oficial de FM, Mondial Forni, Carpigiani, Labus y Roboqbo. Reparación, mantenimiento preventivo y contratos de mantenimiento anual para obradores, heladerías y cadenas.',
  alternates: { canonical: '/servicio-tecnico' },
};

export default function ServicePage() {
  const s = getSettings();
  const wa = whatsappLink(s, 'Hola, vengo de la web y necesito servicio técnico para una máquina.');
  const waContract = whatsappLink(s, 'Hola, vengo de la web y me interesa un contrato de mantenimiento anual.');
  const years = new Date().getFullYear() - s.foundedYear;
  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Servicio técnico de maquinaria de panadería, pastelería y heladería',
    provider: { '@id': absoluteUrl('/#empresa') },
    areaServed: { '@type': 'AdministrativeArea', name: `${s.locality}, ${s.region}` },
    url: absoluteUrl('/servicio-tecnico'),
  };

  return (
    <>
      <Header settings={s} active="service" />
      <main id="contenido" className="service-page">
        <section className="service-hero wrap">
          <div>
            <span className="eyebrow">SERVICIO TÉCNICO · {s.locality.toUpperCase()} ({s.region.toUpperCase()})</span>
            <h1>Servicio técnico de maquinaria para obradores y heladerías.</h1>
            <p>
              Somos una empresa familiar que repara y mantiene maquinaria industrial de panadería, pastelería y heladería desde {s.foundedYear}: más de {years} años de oficio. Mantenemos equipos de grandes cadenas de supermercados y de organismos públicos.
            </p>
            <div className="hero-actions">
              {s.whatsapp && <a className="btn btn-wa-solid" href={wa} target="_blank" rel="noopener"><WhatsAppIcon /> Pedir asistencia por WhatsApp</a>}
              {s.phone && <a className="btn btn-outline" href={`tel:${s.phone}`}><Phone size={17} aria-hidden="true" /> Llamar al {phoneDisplay(s.phone)}</a>}
            </div>
          </div>
          <aside className="official-card" aria-labelledby="oficial-titulo">
            <BadgeCheck size={30} aria-hidden="true" />
            <h2 id="oficial-titulo">Servicio técnico oficial</h2>
            <ul>{officialBrands.map(b => <li key={b}>{b}</li>)}</ul>
            <p>También trabajamos con {otherBrands.join(', ')} y otras marcas.</p>
          </aside>
        </section>

        <section className="service-grid wrap" aria-labelledby="que-hacemos">
          <div className="section-title"><div><div className="eyebrow">QUÉ HACEMOS</div><h2 id="que-hacemos">Tu maquinaria, en marcha.</h2></div></div>
          <div className="service-cards">
            <article>
              <Wrench aria-hidden="true" />
              <h3>Reparación</h3>
              <p>Diagnóstico y reparación de hornos, amasadoras, mantecadoras, pasteurizadores, vitrinas y otros equipos de obrador, en tus instalaciones o en nuestro taller de {s.locality}.</p>
            </article>
            <article>
              <CalendarCheck aria-hidden="true" />
              <h3>Mantenimiento preventivo</h3>
              <p>Revisiones periódicas para anticipar averías, alargar la vida de la maquinaria y evitar paradas en plena producción.</p>
            </article>
            <article>
              <FileSignature aria-hidden="true" />
              <h3>Contratos de mantenimiento</h3>
              <p>Contrato anual para obradores, heladerías y cadenas con varios establecimientos. Lo presupuestamos según tus equipos y necesidades.</p>
            </article>
          </div>
        </section>

        <section className="contract-band wrap" aria-labelledby="contratos">
          <div>
            <span className="eyebrow">CONTRATO DE MANTENIMIENTO ANUAL</span>
            <h2 id="contratos">Para obradores, heladerías y cadenas.</h2>
            <p>Cada contrato se presupuesta a medida. Para prepararlo necesitamos saber:</p>
            <ol className="contract-steps">
              <li><strong>Qué equipos tienes</strong> Marca, modelo y antigüedad de cada máquina.</li>
              <li><strong>Cuántos establecimientos</strong> Uno o varios puntos de venta y obradores.</li>
              <li><strong>Dónde están</strong> La ubicación de cada establecimiento.</li>
            </ol>
          </div>
          <div className="contract-cta">
            <strong>Presupuesto sin compromiso</strong>
            {s.whatsapp && <a className="btn btn-white" href={waContract} target="_blank" rel="noopener"><WhatsAppIcon /> Pedir presupuesto</a>}
            {s.email && <a className="text-link" href={`mailto:${s.email}?subject=${encodeURIComponent('Contrato de mantenimiento anual')}`}><Mail size={16} aria-hidden="true" /> {s.email}</a>}
          </div>
        </section>

        <section className="coverage wrap" aria-labelledby="cobertura">
          <div>
            <span className="eyebrow">ZONA DE COBERTURA</span>
            <h2 id="cobertura">Dónde trabajamos.</h2>
            <p><strong>Servicio técnico:</strong> {s.coverage}</p>
            <p><strong>Venta de maquinaria:</strong> envíos a toda España.</p>
          </div>
          <address className="contact-card">
            <h3>Contacto directo</h3>
            <p><MapPin size={17} aria-hidden="true" /> {s.address}</p>
            <p><Clock size={17} aria-hidden="true" /> {s.openingHours}</p>
            {s.phone && <p><Phone size={17} aria-hidden="true" /> <a href={`tel:${s.phone}`}>{phoneDisplay(s.phone)}</a></p>}
            {s.whatsapp && <p><WhatsAppIcon size={17} /> <a href={wa} target="_blank" rel="noopener">WhatsApp {phoneDisplay('+' + s.whatsapp)}</a></p>}
            {s.email && <p><Mail size={17} aria-hidden="true" /> <a href={`mailto:${s.email}`}>{s.email}</a></p>}
          </address>
        </section>
      </main>
      <Footer settings={s} />
      <JsonLd data={service} />
    </>
  );
}
