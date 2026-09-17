'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { Machine, Settings } from '@/lib/catalog';
import { whatsappLink } from '@/lib/site';
import { ProductImage } from './product-image';
import { WhatsAppIcon } from './icons';

/** Abre la ficha técnica de un modelo nuevo sin salir de la web. */
export function TechSheetButton({ m, settings, onAsk, className, children }: { m: Machine; settings: Settings; onAsk?: (m: Machine) => void; className?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const rows = ([
    ['Tipo', m.type],
    ['Funcionamiento', m.functioning !== m.description ? m.functioning : ''],
    ['Capacidad', m.capacity],
    ['Potencia', m.power],
    ['Alimentación eléctrica', m.voltage],
    ['Dimensiones', m.dimensions],
  ] as const).filter(([, v]) => v);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`Ver ficha de ${m.brand} ${m.model}`}>
        {children}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="tech-sheet">
          <div className="tech-sheet-photo"><ProductImage m={m} sizes="(max-width: 760px) 90vw, 320px" /></div>
          <div className="tech-sheet-copy">
            <p className="tile-meta">{m.brand} · Nueva, bajo propuesta</p>
            <DialogTitle className="tech-sheet-title">{m.model}</DialogTitle>
            <DialogDescription>{m.description}</DialogDescription>
            <dl className="facts">
              {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <p className="tech-sheet-note">Datos orientativos e imagen del fabricante. Precio, configuración y garantía se concretan por escrito.</p>
            <div className="actions">
              {settings.whatsapp && (
                <a className="btn btn-wa-solid" href={whatsappLink(settings, `Hola, vengo de la web y me interesa la ${m.brand} ${m.model}. ¿Me enviáis la ficha técnica y precio?`)} target="_blank" rel="noopener">
                  <WhatsAppIcon /> Pedir ficha y precio
                </a>
              )}
              {onAsk && <button type="button" className="link-button" onClick={() => { setOpen(false); onAsk(m); }}>Prefiero dejar mis datos</button>}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
