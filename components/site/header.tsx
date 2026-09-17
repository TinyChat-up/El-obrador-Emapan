import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { phoneDisplay, type Settings } from '@/lib/catalog';
import { whatsappLink } from '@/lib/site';
import { WhatsAppIcon } from './icons';

export type Section = 'machines' | 'compare' | 'service' | 'sell' | 'none';

export function Header({ settings, active = 'none' }: { settings: Settings; active?: Section }) {
  const current = (s: Section) => (active === s ? { className: 'is-active', 'aria-current': 'page' as const } : {});
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="masthead">
        <div className="masthead-inner wrap">
          <Link className="masthead-logo" href="/" aria-label="El Obrador de Emapan, inicio">
            <Image src="/images/emapan-logo.png" alt="" width={738} height={271} sizes="132px" priority />
            <span className="masthead-name">El Obrador</span>
          </Link>
          <nav className="masthead-nav" aria-label="Navegación principal">
            <Link {...current('machines')} href="/#maquinaria">Maquinaria</Link>
            <Link {...current('compare')} href="/comparar">Comparar</Link>
            <Link {...current('service')} href="/servicio-tecnico">Servicio técnico</Link>
            <Link {...current('sell')} href="/vender">Vender</Link>
          </nav>
          <div className="masthead-contact">
            {settings.phone && (
              <a className="masthead-phone" href={`tel:${settings.phone}`} aria-label={`Llamar al ${phoneDisplay(settings.phone)}`}>
                <Phone size={16} aria-hidden="true" />
                <span>{phoneDisplay(settings.phone)}</span>
              </a>
            )}
            {settings.whatsapp && (
              <a className="btn btn-wa-solid masthead-wa" href={whatsappLink(settings)} target="_blank" rel="noopener">
                <WhatsAppIcon size={17} />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
