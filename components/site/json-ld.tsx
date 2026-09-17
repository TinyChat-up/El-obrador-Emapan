import type { Settings } from '@/lib/catalog';
import { absoluteUrl, siteUrl } from '@/lib/site';

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function localBusiness(s: Settings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': siteUrl() + '/#empresa',
    name: 'El Obrador de Emapan',
    legalName: s.legalName,
    taxID: s.taxId,
    description:
      'Empresa familiar de Alicante dedicada a la reparación y el mantenimiento de maquinaria industrial de panadería, pastelería y heladería, y a la venta de maquinaria de segunda mano revisada en taller.',
    url: siteUrl(),
    logo: absoluteUrl('/images/emapan-logo.png'),
    image: absoluteUrl('/images/emapan-logo.png'),
    telephone: s.phone || undefined,
    email: s.email || undefined,
    foundingDate: String(s.foundedYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.streetAddress,
      postalCode: s.postalCode,
      addressLocality: s.locality,
      addressRegion: s.region,
      addressCountry: 'ES',
    },
    areaServed: { '@type': 'Country', name: 'España' },
    knowsAbout: ['Servicio técnico de maquinaria de panadería', 'Maquinaria de heladería', 'Maquinaria de segunda mano'],
  };
}
