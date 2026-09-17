import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import { WhatsAppIcon } from '@/components/site/icons';
import { getSettings } from '@/lib/server';
import { whatsappLink } from '@/lib/site';
import OfferForm from './offer-form';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Vende tu maquinaria de panadería o heladería',
  description: 'Valoración de maquinaria usada de panadería, heladería, pastelería y hostelería por nuestro servicio técnico. Venta gestionada, depósito en Emapan o compra directa.',
  alternates: { canonical: '/vender' },
};

const options = [
  { title: 'Venta gestionada', rate: '12 % del precio de venta', text: 'La máquina se queda en tus instalaciones. Preparamos el anuncio, filtramos a los interesados y gestionamos la negociación.', note: 'Mínimo orientativo: 600 € + IVA. Transporte, revisión o reparación se presupuestan aparte.' },
  { title: 'Depósito en Emapan', rate: '18 % del precio de venta', text: 'La guardamos en nuestras instalaciones, la documentamos con detalle, la enseñamos y coordinamos la entrega al comprador.', note: 'Mínimo orientativo: 900 € + IVA. Recogida, reparación y almacenaje extraordinario se pactan antes.', recommended: true },
  { title: 'Compra directa', rate: 'Oferta después de inspección', text: 'Emapan compra la máquina y asume la reparación, el almacenaje y el riesgo de venta.', note: 'Es la vía más rápida, pero la oferta será inferior al precio de venta al público.' },
];

export default function SellPage() {
  const settings = getSettings();
  return (
    <>
      <Header settings={settings} active="sell" />
      <main id="contenido">
        <section className="intro intro-single wrap">
          <div className="intro-copy">
            <p className="kicker">Vende tu máquina</p>
            <h1>Véndela con criterio técnico.</h1>
            <p className="lead">Envíanos fotos y datos reales. La valoramos, acordamos contigo cómo venderla y solo la publicamos después de revisar su estado.</p>
            <div className="actions">
              <a className="btn btn-dark" href="#valoracion">Solicitar valoración <ArrowRight size={17} aria-hidden="true" /></a>
              {settings.whatsapp && <a className="btn btn-wa-solid" href={whatsappLink(settings, 'Hola, vengo de la web y quiero vender una máquina: ')} target="_blank" rel="noopener"><WhatsAppIcon /> Enviar fotos por WhatsApp</a>}
            </div>
          </div>
        </section>

        <section className="doors wrap" aria-labelledby="formas-titulo">
          <h2 id="formas-titulo">Tres formas de vender</h2>
          <ul>
            {options.map((o, i) => (
              <li key={o.title}>
                <div>
                  <span className="door-number">{String(i + 1).padStart(2, '0')}{o.recommended && <span className="door-tag">Recomendada</span>}</span>
                  <h3>{o.title}</h3>
                  <p className="door-rate">{o.rate}</p>
                  <p>{o.text}</p>
                  <p className="door-small">{o.note}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="doors-note">Tarifas orientativas, sujetas a valoración y acuerdo por escrito. No son una tasación ni una oferta contractual.</p>
        </section>

        <section className="sell-form" id="valoracion" aria-labelledby="valoracion-titulo">
          <div className="sell-form-inner wrap">
            <div className="sell-form-intro">
              <h2 id="valoracion-titulo">Enséñanos la máquina tal como está.</h2>
              <p>Marca, modelo, año, funcionamiento y mantenimiento cambian mucho el precio. Primero comprobamos; después proponemos.</p>
              <p className="sell-form-sub">Fotos que nos ayudan:</p>
              <ul className="check-list">
                <li>Vista completa</li>
                <li>Placa de características</li>
                <li>Interior y componentes</li>
                <li>Desgaste o averías visibles</li>
              </ul>
            </div>
            <OfferForm />
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
