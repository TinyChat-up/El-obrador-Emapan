import Link from 'next/link';
import Image from 'next/image';
import { Phone, Scale } from 'lucide-react';
import { phoneDisplay, type Settings } from '@/lib/catalog';
import { locationTagline, whatsappLink } from '@/lib/site';
import { WhatsAppIcon } from './icons';

export type Section = 'catalog' | 'service' | 'compare' | 'sell' | 'none';

export function Mark() {
  return <Image className="emapan-header-logo" src="/images/emapan-logo.png" alt="Emapan" width={738} height={271} sizes="176px" priority />;
}

function Wordmark() {
  return (
    <span className="emapan-wordmark">
      <span>EL OBRADOR</span>
      <small>MAQUINARIA DE SEGUNDA MANO</small>
    </span>
  );
}

export function Header({ settings, active = 'none' }: { settings: Settings; active?: Section }) {
  const current = (s: Section) => (active === s ? { className: 'active', 'aria-current': 'page' as const } : {});
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <div className="contact-bar">
        <span className="contact-bar-location">{locationTagline}</span>
        <span className="contact-bar-official">Servicio técnico oficial · Empresa familiar desde {settings.foundedYear}</span>
      </div>
      <header className="site-header">
        <Link className="logo" href="/" aria-label="El Obrador de Emapan, inicio">
          <Mark />
          <Wordmark />
        </Link>
        <nav aria-label="Navegación principal">
          <Link {...current('catalog')} href="/#catalogo">Segunda mano</Link>
          <a {...current('service')} href="/servicio-tecnico">Servicio técnico</a>
          <a {...current('compare')} href="/comparar">Comparar <Scale size={15} aria-hidden="true" /></a>
          <a {...current('sell')} href="/vender"><span className="nav-long">Vende tu máquina</span><span className="nav-short">Vender</span></a>
        </nav>
        <div className="header-contact">
          {settings.phone && (
            <a className="header-phone" href={`tel:${settings.phone}`} aria-label={`Llamar al ${phoneDisplay(settings.phone)}`}>
              <Phone size={17} aria-hidden="true" />
              <span>{phoneDisplay(settings.phone)}</span>
            </a>
          )}
          {settings.whatsapp && (
            <a className="btn btn-wa header-wa" href={whatsappLink(settings)} target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">
              <WhatsAppIcon size={18} />
              <span>WhatsApp</span>
            </a>
          )}
        </div>
      </header>
    </>
  );
}
