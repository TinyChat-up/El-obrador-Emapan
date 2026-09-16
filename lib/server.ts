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

const labels: Record<string, string> = {
  reference: 'Referencia', name: 'Nombre', company: 'Empresa', email: 'Correo', phone: 'Teléfono',
  province: 'Localidad', contact: 'Prefiere contacto', needs: 'Necesidades', machines: 'Máquinas',
  operation: 'Modalidad', brand: 'Marca', model: 'Modelo', year: 'Año', serial: 'Nº de serie',
  working: 'Funcionamiento', condition: 'Estado', expectedPrice: 'Precio esperado (€)',
  description: 'Descripción', photos: 'Fotografías',
};
const hidden = new Set(['id', 'machineIds', 'privacyAccepted', 'privacyVersion', 'demo', 'website']);
const value = (v: unknown) =>
  Array.isArray(v)
    ? '\n  ' + v.map(x => typeof x === 'object' && x !== null
        ? [(x as Record<string, unknown>).brand, (x as Record<string, unknown>).model, (x as Record<string, unknown>).condition].filter(Boolean).join(' · ')
        : String(x)).join('\n  ')
    : typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v);
const detail = (data: Record<string, unknown>) =>
  Object.entries(data)
    .filter(([k, v]) => !hidden.has(k) && v !== '' && v !== null && v !== undefined && !(Array.isArray(v) && !v.length))
    .map(([k, v]) => `${labels[k] ?? k}: ${value(v)}`)
    .join('\n');

// Sin dominio verificado, Resend solo deja enviar desde onboarding@resend.dev
// y únicamente al correo de la propia cuenta: por eso NOTIFICATION_EMAIL
// manda sobre el correo público de lib/catalog.ts.
async function notifyEmail(id: string, data: Record<string, unknown>, s: Settings, subject: string) {
  const e = runtime();
  const to = e.NOTIFICATION_EMAIL || s.email;
  if (!e.RESEND_API_KEY || !to) return 'not_configured';
  const replyTo = typeof data.email === 'string' && data.email ? data.email : undefined;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${e.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `inquiry-${id}` },
      body: JSON.stringify({
        from: e.FROM_EMAIL || 'El Obrador <onboarding@resend.dev>',
        to: [to],
        reply_to: replyTo,
        subject: `${subject} ${id}`,
        text: detail(data),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.error('Resend notification failed', r.status, (await r.text()).slice(0, 300));
    return r.ok ? 'sent' : 'failed';
  } catch { return 'failed'; }
}

// Sin base de datos el correo ES la solicitud: si no sale, hay que decírselo
// al cliente para que vuelva a intentarlo o llame por teléfono.
export async function notifyInquiry(id: string, data: Record<string, unknown>, s: Settings, subject = 'Nueva propuesta') {
  return notifyEmail(id, data, s, subject);
}
