'use client';
import { useState } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SuccessMark } from '@/app/motion';
import type { Machine, Settings } from '@/lib/catalog';
import { whatsappLink } from '@/lib/site';
import { ProductImage } from './product-image';
import { WhatsAppIcon } from './icons';

export function Choice({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: string[]; label: string }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className="choice"><SelectValue /></SelectTrigger>
      <SelectContent>{options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  );
}

function ChoiceField({ name, label, options }: { name: string; label: string; options: string[] }) {
  const [v, setV] = useState(options[0]);
  return <><input type="hidden" name={name} value={v} /><Choice value={v} onChange={setV} options={options} label={label} /></>;
}

const machineNames = (ms: Machine[]) => ms.map(m => `${m.brand} ${m.model}`).join(', ');

/**
 * Formulario «Prepara mi propuesta». Móntalo con una `key` nueva cada vez que
 * se abra para que empiece limpio.
 */
export function InquiryDialog({ open, onOpenChange, machines, settings }: { open: boolean; onOpenChange: (v: boolean) => void; machines: Machine[]; settings: Settings }) {
  const [busy, setBusy] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [notice, setNotice] = useState('');
  const [consent, setConsent] = useState(false);
  const [requestKey] = useState(() => crypto.randomUUID());

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) return;
    setBusy(true);
    setNotice('');
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: requestKey, name: f.get('name'), email: f.get('email'), phone: f.get('phone'), company: f.get('company'), province: f.get('province'), needs: f.get('needs'), contact: f.get('contact'), website: f.get('website'), machineIds: machines.map(m => m.id), privacyAccepted: true }),
      });
      const data = (await res.json()) as { error?: string; id: string; demo: boolean };
      if (!res.ok) throw new Error(data.error || 'No se ha podido guardar. Inténtalo de nuevo.');
      setRequestId(data.id);
      setNotice(data.demo ? 'Modo demostración: la solicitud no se ha enviado a nadie.' : 'Hemos recibido tu solicitud. Te contestaremos lo antes posible por el canal que has elegido.');
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Ha ocurrido un error. Tus datos siguen en el formulario.');
    } finally {
      setBusy(false);
    }
  }

  const waText = machines.length ? `Hola, vengo de la web y me interesa: ${machineNames(machines)}.` : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="inquiry-modal">
        <DialogTitle className={requestId ? 'sr-only' : 'modal-title'}>{requestId ? 'Solicitud enviada' : 'Prepara mi propuesta.'}</DialogTitle>
        <DialogDescription className={requestId ? 'sr-only' : ''}>{requestId ? 'Confirmación de tu solicitud.' : 'Cuéntanos qué necesitas. Concretaremos máquina, envío y garantía.'}</DialogDescription>
        {requestId ? (
          <div className="request-success" role="status">
            <SuccessMark />
            <h3>{settings.liveInquiries ? '¡Solicitud enviada!' : 'Prueba registrada'}</h3>
            <p>{notice}</p>
            <small className="success-ref">Referencia <code>{requestId.slice(0, 11).toUpperCase()}</code></small>
            {settings.whatsapp && settings.liveInquiries && (
              <div className="success-whatsapp">
                <span>¿Prefieres hablarlo ahora?</span>
                <a className="btn btn-whatsapp" target="_blank" rel="noopener" href={whatsappLink(settings, `Hola, he enviado la solicitud ${requestId.slice(0, 11).toUpperCase()}. Me interesa: ${machineNames(machines) || 'asesoramiento sobre maquinaria'}.`)}>
                  <WhatsAppIcon /> Escríbenos por WhatsApp
                </a>
              </div>
            )}
            <button className="btn btn-outline full" onClick={() => onOpenChange(false)}>Seguir explorando</button>
          </div>
        ) : (
          <form onSubmit={submit} className="inquiry-form">
            {settings.whatsapp && (
              <a className="inquiry-shortcut" href={whatsappLink(settings, waText)} target="_blank" rel="noopener">
                <WhatsAppIcon /> <span>¿Con prisa? <strong>Escríbenos por WhatsApp</strong> y te contestamos antes.</span>
              </a>
            )}
            {machines.length > 0 && (
              <div className="inquiry-selection">
                {machines.map(m => (
                  <div key={m.id}>
                    <ProductImage m={m} sizes="44px" />
                    <span><strong>{m.brand} {m.model}</strong><small>{m.condition === 'Nueva' ? 'Nueva · bajo propuesta' : 'Segunda mano · revisada'}</small></span>
                  </div>
                ))}
              </div>
            )}
            {!settings.liveInquiries && <p className="form-note">Modo demostración: puedes probar el formulario, pero la consulta no se enviará.</p>}
            <div className="form-grid">
              <label>Tu nombre *<input name="name" autoComplete="name" maxLength={100} required placeholder="Nombre y apellidos" /></label>
              <label>Empresa<input name="company" autoComplete="organization" maxLength={150} placeholder="Nombre de tu negocio" /></label>
              <label>Correo electrónico<input name="email" type="email" autoComplete="email" maxLength={150} placeholder="tu@empresa.es" /></label>
              <label>Teléfono<input name="phone" type="tel" autoComplete="tel" maxLength={25} placeholder="+34 600 000 000" /></label>
              <label>Código postal / localidad<input name="province" autoComplete="postal-code" maxLength={100} placeholder="Para calcular el transporte" /></label>
              <label>Prefiero que me contactéis<ChoiceField name="contact" label="Canal de contacto preferido" options={['Por teléfono', 'Por WhatsApp', 'Por correo']} /></label>
            </div>
            <small className="contact-help">Indica al menos un correo válido o un teléfono.</small>
            <label>¿Qué necesita tu proyecto?<textarea name="needs" rows={3} maxLength={3000} placeholder="Producción, espacio disponible, accesos, fecha prevista…" /></label>
            <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <label className="consent">
              <Checkbox checked={consent} onCheckedChange={v => setConsent(v === true)} aria-label="Acepto la política de privacidad" />
              <span>He leído y acepto la <a href="/privacidad" target="_blank">política de privacidad</a> para que gestionéis esta solicitud. No recibiré publicidad por enviarla.</span>
            </label>
            {notice && <p className="form-error" role="alert">{notice}</p>}
            <button disabled={busy || !consent} className="btn btn-dark full" type="submit">
              {busy ? <><Loader2 className="spin" size={17} /> Guardando solicitud…</> : <>{settings.liveInquiries ? 'Enviar mi solicitud' : 'Guardar solicitud de prueba'} <ArrowUpRight size={18} /></>}
            </button>
            <p className="form-bottom">Sin compra ni compromiso. La propuesta se concreta contigo.</p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Botón con su propio formulario, para páginas de servidor. */
export function InquiryButton({ machines = [], settings, className = 'btn btn-outline', children }: { machines?: Machine[]; settings: Settings; className?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(0);
  return (
    <>
      <button type="button" className={className} onClick={() => { setSession(s => s + 1); setOpen(true); }}>{children}</button>
      {session > 0 && <InquiryDialog key={session} open={open} onOpenChange={setOpen} machines={machines} settings={settings} />}
    </>
  );
}
