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
export async function notifyInquiry(id:string,data:Record<string,unknown>,s:Settings,subject='Nueva propuesta'){const e=runtime();if(!e.RESEND_API_KEY||!e.FROM_EMAIL||!s.email)return 'not_configured';try{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${e.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`inquiry-${id}`},body:JSON.stringify({from:e.FROM_EMAIL,to:[s.email],subject:`${subject} ${id}`,text:Object.entries(data).map(([k,v])=>`${k}: ${typeof v==='object'?JSON.stringify(v):v}`).join('\n')}),signal:AbortSignal.timeout(8000)});return r.ok?'sent':'failed';}catch{return 'failed';}}
