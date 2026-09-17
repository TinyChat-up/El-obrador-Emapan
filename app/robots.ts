import type { MetadataRoute } from 'next';
import { absoluteUrl, isIndexable } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Las vistas previas de Vercel no deben aparecer en Google.
  if (!isIndexable()) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
