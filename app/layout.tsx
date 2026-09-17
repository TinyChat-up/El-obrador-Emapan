import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import "./vintage.css";
import "./motion.css";
import "./site.css";
import Motion from "./motion";
import { getSettings } from "@/lib/server";
import { isIndexable, siteUrl } from "@/lib/site";
import { JsonLd, localBusiness } from "@/components/site/json-ld";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Maquinaria de panadería y heladería de segunda mano revisada | El Obrador de Emapan",
    template: "%s | El Obrador de Emapan",
  },
  description:
    "Maquinaria de segunda mano para panadería, pastelería, heladería y hostelería, revisada en taller y con garantía por escrito. Servicio técnico oficial en Alicante. Envíos a toda España.",
  applicationName: "El Obrador de Emapan",
  openGraph: { type: "website", locale: "es_ES", siteName: "El Obrador de Emapan", images: [{ url: "/images/emapan-logo.png", width: 738, height: 271, alt: "Emapan" }] },
  robots: isIndexable() ? { index: true, follow: true } : { index: false, follow: false },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#123d78" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  return (
    <html lang="es">
      <body>
        <Motion />
        {children}
        <WhatsAppFloat settings={settings} />
        <JsonLd data={localBusiness(settings)} />
        {/* Vercel Web Analytics no usa cookies: no necesita banner. Se activa en Vercel > Analytics. */}
        <Analytics />
      </body>
    </html>
  );
}
