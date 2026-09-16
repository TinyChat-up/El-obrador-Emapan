import { db } from '@/db';
import { storage } from './supabase';
import { getUser } from '@/lib/auth';
import { defaults,demos,partnerBrands,type Machine,type Settings } from './catalog';
export const runtime=()=>({...process.env,BUCKET:storage});
export { db } from '@/db';
export async function getSettings():Promise<Settings>{const row=await db().prepare('SELECT data FROM settings WHERE id=1').first<{data:string}>();const saved=row?JSON.parse(row.data):{};const e=runtime();return {...defaults,...saved,brand:!saved.brand||saved.brand==='OBRADOR'?defaults.brand:saved.brand,legalName:saved.legalName||defaults.legalName,email:saved.email||e.NOTIFICATION_EMAIL||'',privacyEmail:saved.privacyEmail||e.NOTIFICATION_EMAIL||'',whatsapp:saved.whatsapp||e.WHATSAPP_NUMBER||'',liveInquiries:typeof saved.liveInquiries==='boolean'?saved.liveInquiries:e.LIVE_INQUIRIES==='true'};}
export async function catalog(all=false){
 const settings=await getSettings();const {results}=await db().prepare('SELECT data FROM machines ORDER BY updated DESC').all<{data:string}>();
 const records=results.map(r=>JSON.parse(r.data) as Machine);
 const refs=[...demos.filter(m=>m.condition==='Nueva').map(d=>records.find(m=>m.id===d.id)||d),...records.filter(m=>m.condition==='Nueva'&&!demos.some(d=>d.id===m.id))].filter(m=>m.condition==='Nueva'&&partnerBrands.some(b=>b.toLowerCase()===m.brand.toLowerCase()));
 const referenceMachines=refs.filter(m=>all||m.published);
 const used=records.filter(m=>m.condition==='Reacondicionada'&&!m.isDemo);
 return {settings,machines:all?[...used,...refs]:used.filter(m=>m.published&&!['Vendida','Retirada'].includes(m.availability)),referenceMachines};
}
export async function owner(){const user=await getUser();const expected=await db().prepare('SELECT user_id FROM admins WHERE id=2').first<{user_id:string}>();if(!user||!expected||user.userId!==expected.user_id)throw new Error('Acceso restringido');return user;}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');if(!origin||origin!==new URL(req.url).origin)throw new Error('Origen no permitido');}
export function fail(e:unknown,status=400){console.error(e instanceof Error?e.message:'Request failed');return Response.json({error:e instanceof Error?e.message:'No se ha podido completar la operación'},{status,headers:{'Cache-Control':'no-store'}});}
// Texto completo de la solicitud, para el cuerpo del correo.
const detail=(data:Record<string,unknown>)=>Object.entries(data).map(([k,v])=>`${k}: ${typeof v==='object'?JSON.stringify(v):v}`).join('\n');
// Resumen de una sola línea. Las variables de una plantilla de WhatsApp no
// admiten saltos de línea, tabuladores ni más de cuatro espacios seguidos.
const skip=new Set(['photos','machines','machineIds','notes','privacyVersion','privacyAccepted','reference','demo','id','website']);
function summary(data:Record<string,unknown>){
 const parts=Object.entries(data).filter(([k,v])=>!skip.has(k)&&v!==''&&v!==null&&v!==undefined).map(([k,v])=>`${k}: ${typeof v==='object'?JSON.stringify(v):v}`);
 const list=data.machines;
 if(Array.isArray(list)&&list.length)parts.push('máquinas: '+(list as {brand?:string;model?:string}[]).map(m=>`${m.brand??''} ${m.model??''}`.trim()).join(', '));
 return parts.join(' · ');
}
const param=(value:string)=>({type:'text',text:(value.replace(/\s+/g,' ').trim()||'—').slice(0,900)});

async function notifyEmail(id:string,data:Record<string,unknown>,s:Settings,subject:string){
 const e=runtime();
 if(!e.RESEND_API_KEY||!e.FROM_EMAIL||!s.email)return 'not_configured';
 try{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${e.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`inquiry-${id}`},body:JSON.stringify({from:e.FROM_EMAIL,to:[s.email],subject:`${subject} ${id}`,text:detail(data)}),signal:AbortSignal.timeout(8000)});
  if(!r.ok)console.error('Resend notification failed',r.status);
  return r.ok?'sent':'failed';}catch{return 'failed';}
}

// WhatsApp Cloud API de Meta. El aviso lo inicia el servidor fuera de la
// ventana de 24 horas, así que debe enviarse con una plantilla aprobada.
export function whatsappReady(){const e=runtime();return !!(e.WHATSAPP_TOKEN&&e.WHATSAPP_PHONE_ID&&e.WHATSAPP_TO);}
async function notifyWhatsApp(id:string,data:Record<string,unknown>,subject:string){
 const e=runtime();const to=(e.WHATSAPP_TO||'').replace(/\D/g,'');
 if(!e.WHATSAPP_TOKEN||!e.WHATSAPP_PHONE_ID||!to)return 'not_configured';
 try{const r=await fetch(`https://graph.facebook.com/v23.0/${e.WHATSAPP_PHONE_ID}/messages`,{method:'POST',headers:{Authorization:`Bearer ${e.WHATSAPP_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({messaging_product:'whatsapp',recipient_type:'individual',to,type:'template',template:{name:e.WHATSAPP_TEMPLATE||'aviso_solicitud',language:{code:e.WHATSAPP_TEMPLATE_LANG||'es'},components:[{type:'body',parameters:[param(subject),param(id),param(summary(data))]}]}}),signal:AbortSignal.timeout(8000)});
  if(!r.ok)console.error('WhatsApp notification failed',r.status,(await r.text()).slice(0,300));
  return r.ok?'sent':'failed';}catch{return 'failed';}
}

// Devuelve 'sent' si todos los canales conectados salieron, 'partial' si solo
// uno, 'failed' si ninguno y 'not_configured' si no hay ningún canal.
export async function notifyInquiry(id:string,data:Record<string,unknown>,s:Settings,subject='Nueva propuesta'){
 const states=await Promise.all([notifyEmail(id,data,s,subject),notifyWhatsApp(id,data,subject)]);
 if(states.every(x=>x==='not_configured'))return 'not_configured';
 if(states.every(x=>x==='sent'||x==='not_configured'))return 'sent';
 return states.some(x=>x==='sent')?'partial':'failed';
}
