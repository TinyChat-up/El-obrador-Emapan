import Link from 'next/link';
import type { Settings } from '@/lib/catalog';

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="colophon">
      <div className="colophon-inner wrap">
        <p>
          © {new Date().getFullYear()} {settings.legalName} · CIF {settings.taxId}
          <br />
          {settings.address}
        </p>
        <nav aria-label="Enlaces del pie">
          <Link href="/#maquinaria">Maquinaria</Link>
          <Link href="/comparar">Comparar</Link>
          <Link href="/servicio-tecnico">Servicio técnico</Link>
          <Link href="/vender">Vender</Link>
          <Link href="/privacidad">Aviso legal y privacidad</Link>
        </nav>
      </div>
    </footer>
  );
}
