import { storage } from './supabase';
import { settings as empresa, demos, partnerBrands, type Settings } from './catalog';
import { stock } from './stock';

export const runtime = () => ({ ...process.env, BUCKET: storage });

// Los datos de la empresa viven en lib/catalog.ts. Las variables de entorno
// solo rellenan los huecos que se hayan dejado vacíos allí.
export function getSettings(): Settings {
  const e = runtime();
  return {
    ...empresa,
    email: empresa.email || e.NOTIFICATION_EMAIL || '',
    privacyEmail: empresa.privacyEmail || e.NOTIFICATION_EMAIL || '',
    whatsapp: empresa.whatsapp || e.WHATSAPP_NUMBER || '',
    liveInquiries: empresa.liveInquiries || e.LIVE_INQUIRIES === 'true',
  };
}

// El catálogo se arma con lo que hay en el código: no hay base de datos, así
// que no puede fallar ni quedarse «no disponible».
export function catalog() {
  const referenceMachines = demos.filter(
    m => m.published && partnerBrands.some(b => b.toLowerCase() === m.brand.toLowerCase()),
  );
  const machines = stock.filter(
    m => m.published && !['Vendida', 'Retirada'].includes(m.availability),
  );
  return { settings: getSettings(), machines, referenceMachines };
}

export function sameOrigin(req: Request) {
  const origin = req.headers.get('origin');
  const expected = new URL(req.url).origin;
  if (!origin || origin !== expected)
    throw new Error(`Origen no permitido: ${origin || 'sin cabecera Origin'} frente a ${expected}`);
}

export function fail(e: unknown, status = 400) {
  console.error(e instanceof Error ? e.message : 'Request failed');
  return Response.json(
    { error: e instanceof Error ? e.message : 'No se ha podido completar la operación' },
    { status, headers: { 'Cache-Control': 'no-store' } },
  );
}

// Freno antifloods de emergencia. Sin base de datos no hay contador
// compartido, así que solo alcanza a la instancia que atiende la petición:
// detiene un envío repetido, no un ataque distribuido. El señuelo del
// formulario sigue siendo la defensa principal.
const recent = new Map<string, number[]>();
export function tooManyRequests(req: Request, limit: number, windowMs = 3600000) {
  const ip = req.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter(t => now - t < windowMs);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 500) for (const [k, v] of recent) if (!v.some(t => now - t < windowMs)) recent.delete(k);
  return hits.length > limit;
}

// ─── Avisos ───────────────────────────────────────────────────────────────

const line = (k: string, v: unknown) =>
  `${k}: ${Array.isArray(v) ? v.join('\n  ') : typeof v === 'object' && v !== null ? JSON.stringify(v) : v}`;
const detail = (data: Record<string, unknown>) =>
  Object.entries(data).map(([k, v]) => line(k, v)).join('\n');

// Las variables de una plantilla de WhatsApp no admiten saltos de línea,
// tabuladores ni más de cuatro espacios seguidos.
const skip = new Set(['machines', 'machineIds', 'notes', 'privacyVersion', 'privacyAccepted', 'reference', 'demo', 'id', 'website']);
function summary(data: Record<string, unknown>) {
  const parts = Object.entries(data)
    .filter(([k, v]) => !skip.has(k) && v !== '' && v !== null && v !== undefined)
    .map(([k, v]) => line(k, v).replace(/\n\s*/g, ' '));
  const list = data.machines;
  if (Array.isArray(list) && list.length)
    parts.push('máquinas: ' + (list as { brand?: string; model?: string }[]).map(m => `${m.brand ?? ''} ${m.model ?? ''}`.trim()).join(', '));
  return parts.join(' · ');
}
const param = (value: string) => ({ type: 'text', text: (value.replace(/\s+/g, ' ').trim() || '—').slice(0, 900) });

async function notifyEmail(id: string, data: Record<string, unknown>, s: Settings, subject: string) {
  const e = runtime();
  if (!e.RESEND_API_KEY || !e.FROM_EMAIL || !s.email) return 'not_configured';
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${e.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `inquiry-${id}` },
      body: JSON.stringify({ from: e.FROM_EMAIL, to: [s.email], subject: `${subject} ${id}`, text: detail(data) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.error('Resend notification failed', r.status);
    return r.ok ? 'sent' : 'failed';
  } catch { return 'failed'; }
}

// WhatsApp Cloud API de Meta. El aviso lo inicia el servidor fuera de la
// ventana de 24 horas, así que debe enviarse con una plantilla aprobada.
export function whatsappReady() {
  const e = runtime();
  return !!(e.WHATSAPP_TOKEN && e.WHATSAPP_PHONE_ID && e.WHATSAPP_TO);
}
async function notifyWhatsApp(id: string, data: Record<string, unknown>, subject: string) {
  const e = runtime();
  const to = (e.WHATSAPP_TO || '').replace(/\D/g, '');
  if (!e.WHATSAPP_TOKEN || !e.WHATSAPP_PHONE_ID || !to) return 'not_configured';
  try {
    const r = await fetch(`https://graph.facebook.com/v23.0/${e.WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${e.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp', recipient_type: 'individual', to, type: 'template',
        template: {
          name: e.WHATSAPP_TEMPLATE || 'aviso_solicitud',
          language: { code: e.WHATSAPP_TEMPLATE_LANG || 'es' },
          components: [{ type: 'body', parameters: [param(subject), param(id), param(summary(data))] }],
        },
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.error('WhatsApp notification failed', r.status, (await r.text()).slice(0, 300));
    return r.ok ? 'sent' : 'failed';
  } catch { return 'failed'; }
}

// Sin base de datos el aviso ES la solicitud: si ningún canal sale, hay que
// decírselo al cliente para que vuelva a intentarlo o llame por teléfono.
export async function notifyInquiry(id: string, data: Record<string, unknown>, s: Settings, subject = 'Nueva propuesta') {
  const states = await Promise.all([notifyEmail(id, data, s, subject), notifyWhatsApp(id, data, subject)]);
  if (states.every(x => x === 'not_configured')) return 'not_configured';
  if (states.every(x => x === 'sent' || x === 'not_configured')) return 'sent';
  return states.some(x => x === 'sent') ? 'partial' : 'failed';
}
