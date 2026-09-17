import Image from 'next/image';
import { Camera } from 'lucide-react';
import type { Machine } from '@/lib/catalog';

const CARD_SIZES = '(max-width: 480px) 92vw, (max-width: 760px) 46vw, 420px';

/** Foto principal de una máquina, optimizada y con carga diferida. */
export function ProductImage({ m, sizes = CARD_SIZES, priority = false }: { m: Machine; sizes?: string; priority?: boolean }) {
  const photo = m.images[0];
  if (!photo)
    return (
      <div className="no-image">
        <Camera aria-hidden="true" />
        <span>Fotografías pendientes</span>
      </div>
    );
  return (
    <span className="img-fill">
      <Image src={photo.url} alt={photo.label} fill sizes={sizes} priority={priority} />
    </span>
  );
}
