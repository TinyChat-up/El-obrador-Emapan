import { phoneDisplay, type Settings } from './catalog';

/**
 * Dirección pública del sitio, sin barra final. Se configura con la variable
 * NEXT_PUBLIC_SITE_URL (p. ej. https://www.elobradordeemapan.es). Si falta,
 * se usa el dominio de producción que asigna Vercel y, en local, localhost.
 */
export function siteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return 'http://localhost:3000';
}

export const absoluteUrl = (path: string) => siteUrl() + (path.startsWith('/') ? path : '/' + path);

/** Solo el despliegue de producción se deja indexar. */
export const isIndexable = () => !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production';

export const DEFAULT_WHATSAPP_TEXT = 'Hola, vengo de la web y me interesa una máquina';

export function whatsappLink(s: Pick<Settings, 'whatsapp'>, text = DEFAULT_WHATSAPP_TEXT) {
  return `https://wa.me/${s.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const telLink = (s: Pick<Settings, 'phone'>) => `tel:${s.phone}`;
export const phoneLabel = (s: Pick<Settings, 'phone'>) => phoneDisplay(s.phone);

export const locationTagline = 'Alicante · Envíos a toda España';
