import Link from 'next/link';
import { phoneDisplay, type Settings } from '@/lib/catalog';
import { whatsappLink } from '@/lib/site';
import { Mark } from './header';

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Link className="logo" href="/" aria-label="El Obrador de Emapan, inicio">
          <Mark />
          <span className="emapan-wordmark"><span>EL OBRADOR</span><small>MAQUINARIA DE SEGUNDA MANO</small></span>
        </Link>
        <p>Maquinaria de segunda mano revisada en taller y servicio técnico oficial para panadería, pastelería y heladería.</p>
      </div>
      <address className="footer-contact">
        <strong>{settings.legalName}</strong>
        <span>{settings.address}</span>
        {settings.phone && <a href={`tel:${settings.phone}`}>Tel. {phoneDisplay(settings.phone)}</a>}
        {settings.whatsapp && <a href={whatsappLink(settings)} target="_blank" rel="noopener">WhatsApp</a>}
        {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
      </address>
      <nav className="footer-links" aria-label="Enlaces del pie">
        <Link href="/#catalogo">Segunda mano</Link>
        <a href="/servicio-tecnico">Servicio técnico</a>
        <a href="/comparar">Comparar máquinas</a>
        <a href="/vender">Vende tu máquina</a>
        <a href="/privacidad">Aviso legal y privacidad</a>
      </nav>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {settings.legalName} · CIF {settings.taxId}</span>
        <span>Sin compra online: precio, envío y garantía se concretan por escrito.</span>
      </div>
    </footer>
  );
}
