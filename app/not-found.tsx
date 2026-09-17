import Link from 'next/link';
import { getSettings } from '@/lib/server';
import { whatsappLink } from '@/lib/site';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import { WhatsAppIcon } from '@/components/site/icons';

export default function NotFound() {
  const s = getSettings();
  return (
    <>
      <Header settings={s} />
      <main id="contenido" className="empty-state wrap" style={{ minHeight: '60vh' }}>
        <h1>No encontramos esta página.</h1>
        <p>Puede que la máquina ya no esté en el catálogo. Cuéntanos qué buscas y te ayudamos.</p>
        <div className="hero-actions">
          <Link className="btn btn-dark" href="/#maquinaria">Ver máquinas disponibles</Link>
          {s.whatsapp && <a className="btn btn-wa" href={whatsappLink(s)} target="_blank" rel="noopener"><WhatsAppIcon /> Escríbenos por WhatsApp</a>}
        </div>
      </main>
      <Footer settings={s} />
    </>
  );
}
