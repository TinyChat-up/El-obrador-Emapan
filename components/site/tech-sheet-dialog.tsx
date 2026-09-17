'use client';
import { useState } from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { Machine, Settings } from '@/lib/catalog';
import { whatsappLink } from '@/lib/site';
import { ProductImage } from './product-image';
import { WhatsAppIcon } from './icons';

/** «Ficha técnica» de un modelo nuevo, sin salir de la web. */
export function TechSheetButton({ m, settings, onAsk, className = 'btn btn-outline' }: { m: Machine; settings: Settings; onAsk?: (m: Machine) => void; className?: string }) {
  const [open, setOpen] = useState(false);
  const rows: [string, string][] = [
    ['Tipo', m.type],
    ['Sector', m.category],
    ['Funcionamiento', m.functioning],
    ['Capacidad', m.capacity || 'Según configuración'],
    ['Potencia', m.power || 'Te la confirmamos en la propuesta'],
    ['Alimentación eléctrica', m.voltage || 'Te la confirmamos en la propuesta'],
    ['Dimensiones', m.dimensions || 'Te las confirmamos en la propuesta'],
  ];
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)} aria-haspopup="dialog">
        <FileText size={16} aria-hidden="true" /> Ficha técnica
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="tech-sheet">
          <div className="tech-sheet-photo"><ProductImage m={m} sizes="(max-width: 760px) 90vw, 320px" /></div>
          <div className="tech-sheet-copy">
            <span className="card-brand">{m.brand} · Nueva · Bajo propuesta</span>
            <DialogTitle className="tech-sheet-title">{m.brand} {m.model}</DialogTitle>
            <DialogDescription>{m.description}</DialogDescription>
            <dl className="tech-sheet-specs">
              {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <p className="tech-sheet-note">Datos orientativos del fabricante. La configuración exacta, el precio y la garantía se concretan por escrito en tu propuesta. Imagen del fabricante.</p>
            <div className="tech-sheet-actions">
              {settings.whatsapp && (
                <a className="btn btn-wa" href={whatsappLink(settings, `Hola, vengo de la web y me gustaría recibir la ficha técnica completa de la ${m.brand} ${m.model}.`)} target="_blank" rel="noopener">
                  <WhatsAppIcon /> Pedir ficha técnica
                </a>
              )}
              {onAsk && (
                <button type="button" className="btn btn-outline" onClick={() => { setOpen(false); onAsk(m); }}>
                  Pedir propuesta <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
