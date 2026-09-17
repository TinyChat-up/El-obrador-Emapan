import Image from 'next/image';
import { Camera } from 'lucide-react';
import { warranty, workshopPhoto } from '@/lib/catalog';

/** Qué revisamos antes de vender una máquina. Revísalo con el taller si cambia el procedimiento. */
export const reviewSteps = [
  'Identificación: placa, número de serie y año',
  'Instalación eléctrica y dispositivos de seguridad',
  'Motores, transmisión y rodamientos',
  'Circuito de frío o de calor, según la máquina',
  'Piezas de desgaste, limpieza e higiene',
  'Prueba de funcionamiento con ciclos completos',
];

export function ReviewSection() {
  return (
    <section className="review" aria-labelledby="revision-titulo">
      <div className="review-inner wrap">
        <figure className="workshop-photo">
          {workshopPhoto.src ? (
            <Image src={workshopPhoto.src} alt={workshopPhoto.alt} fill sizes="(max-width: 860px) 92vw, 560px" />
          ) : (
            <div className="photo-placeholder" role="img" aria-label="Espacio reservado para una foto real del taller">
              <Camera size={28} aria-hidden="true" />
              <span>[PENDIENTE: foto real del taller o del equipo]</span>
            </div>
          )}
        </figure>
        <div>
          <h2 id="revision-titulo">Antes de venderla, la revisamos a fondo.</h2>
          <p>
            Lo hace en nuestro taller de Elda el mismo equipo que mantiene maquinaria de grandes cadenas de supermercados y de organismos públicos.
          </p>
          <ol className="review-list">
            {reviewSteps.map((step, i) => (
              <li key={step}><span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{step}</li>
            ))}
          </ol>
          <p className="review-warranty"><strong>Garantía por escrito.</strong> {warranty}</p>
        </div>
      </div>
    </section>
  );
}
