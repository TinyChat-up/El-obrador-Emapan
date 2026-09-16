import { catalog, fail, sameOrigin, notifyInquiry, tooManyRequests } from '@/lib/server';
import { inquirySchema } from '@/lib/validation';

export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const raw = await req.text();
    if (raw.length > 20000) return fail(new Error('La solicitud es demasiado larga'));
    const parse = inquirySchema.safeParse(JSON.parse(raw));
    if (!parse.success) return fail(new Error(parse.error.issues[0].message));
    const d = parse.data;
    if (d.website) return fail(new Error('No se ha podido procesar la solicitud'));
    if (tooManyRequests(req, 5))
      return fail(new Error('Has enviado varias solicitudes. Espera una hora o utiliza el canal de contacto directo.'), 429);

    const { machines, referenceMachines, settings } = catalog();
    const known = [...machines, ...referenceMachines.filter(r => !machines.some(m => m.id === r.id))];
    if (d.machineIds.some(id => !known.some(m => m.id === id && !['Vendida', 'Retirada'].includes(m.availability))))
      return fail(new Error('Una máquina ya no está disponible. Actualiza tu selección.'));

    const id = 'OB-' + d.id;
    const { website, ...clean } = d;
    void website;
    const data = {
      ...clean,
      reference: id,
      machines: d.machineIds.map(mid => {
        const m = known.find(m => m.id === mid)!;
        return { id: mid, brand: m.brand, model: m.model, condition: m.condition, isDemo: m.isDemo };
      }),
      privacyVersion: '2026-09-13',
      demo: !settings.liveInquiries,
    };

    const notification = settings.liveInquiries ? await notifyInquiry(id, data, settings) : 'demo';
    // Sin base de datos el aviso es el único registro: si no sale, el cliente
    // debe saberlo en vez de irse creyendo que le vamos a llamar.
    if (notification === 'failed' || notification === 'not_configured')
      return fail(new Error('No hemos podido registrar tu solicitud. Vuelve a intentarlo o escríbenos por WhatsApp.'), 503);

    return Response.json({ id, demo: !settings.liveInquiries, notification }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    console.error('Inquiry failed', e instanceof Error ? e.message : '');
    return fail(new Error('No hemos podido guardar tu solicitud. Tus datos siguen en el formulario; vuelve a intentarlo.'), 503);
  }
}
