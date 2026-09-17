import type { Settings } from '@/lib/catalog';
import { whatsappLink } from '@/lib/site';
import { WhatsAppIcon } from './icons';

/** Botón fijo de WhatsApp, presente en todas las páginas. */
export function WhatsAppFloat({ settings }: { settings: Settings }) {
  if (!settings.whatsapp) return null;
  return (
    <a className="wa-float" href={whatsappLink(settings)} target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">
      <WhatsAppIcon size={26} />
      <span className="wa-float-label">¿Hablamos?</span>
    </a>
  );
}
