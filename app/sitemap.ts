import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';
import { allUsedMachines } from '@/lib/used-machines';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/servicio-tecnico'), changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/vender'), changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteUrl('/comparar'), changeFrequency: 'monthly', priority: 0.4 },
    { url: absoluteUrl('/privacidad'), changeFrequency: 'yearly', priority: 0.1 },
  ];
  const machines: MetadataRoute.Sitemap = allUsedMachines().map(m => ({
    url: absoluteUrl(`/maquina/${m.slug}`),
    changeFrequency: 'weekly',
    priority: m.disponibilidad === 'vendida' ? 0.3 : 0.8,
    images: m.fotos.slice(0, 1).map(f => absoluteUrl(f.src)),
  }));
  return [...pages, ...machines];
}
