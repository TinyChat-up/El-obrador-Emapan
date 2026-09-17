'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Camera, Maximize2, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { UsedMachine } from '@/lib/used-machines';

export function MachineGallery({ name, photos }: { name: string; photos: UsedMachine['fotos'] }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const photo = photos[index];
  if (!photo)
    return (
      <div className="gallery-view empty-photo">
        <Camera size={36} aria-hidden="true" />
        <p>Fotografías de esta unidad en preparación. Pídenos fotos o vídeo por WhatsApp.</p>
      </div>
    );
  return (
    <>
      <div className="gallery-view">
        <button type="button" className="gallery-main" onClick={() => setZoom(true)} aria-label={`Ampliar foto: ${photo.alt}`}>
          <span className="img-fill">
            <Image src={photo.src} alt={photo.alt} fill priority={index === 0} sizes="(max-width: 760px) 100vw, 55vw" />
          </span>
          <span className="zoom-label"><Maximize2 size={16} aria-hidden="true" /> Ampliar</span>
        </button>
      </div>
      {photos.length > 1 && (
        <div className="thumb-row" role="group" aria-label="Elegir fotografía">
          {photos.map((p, i) => (
            <button type="button" key={p.src} className={i === index ? 'chosen' : ''} onClick={() => setIndex(i)} aria-label={`Ver foto ${i + 1}: ${p.alt}`} aria-pressed={i === index}>
              <span className="img-fill"><Image src={p.src} alt="" fill sizes="66px" /></span>
            </button>
          ))}
        </div>
      )}
      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="zoom-modal">
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>{photo.alt}</DialogDescription>
          <div className="zoom-viewport">
            <span className="img-fill"><Image src={photo.src} alt={photo.alt} fill sizes="100vw" /></span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Vídeo propio o de YouTube. YouTube solo se carga cuando el cliente pulsa. */
export function MachineVideo({ name, video }: { name: string; video: NonNullable<UsedMachine['video']> }) {
  const [play, setPlay] = useState(false);
  if (video.kind === 'file')
    return <video className="machine-video" src={video.src} controls preload="metadata" playsInline aria-label={`Vídeo de ${name}`} />;
  if (!play)
    return (
      <button type="button" className="machine-video video-facade" onClick={() => setPlay(true)}>
        <Play size={28} aria-hidden="true" />
        <span>Ver vídeo de la máquina</span>
        <small>Se cargará desde YouTube</small>
      </button>
    );
  return (
    <iframe
      className="machine-video"
      src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
      title={`Vídeo de ${name}`}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );
}
