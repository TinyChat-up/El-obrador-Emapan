import { db,fail,getSettings,notifyInquiry,runtime,sameOrigin } from '@/lib/server';
import { machineOfferSchema } from '@/lib/validation';

const MAX_FILE=4*1024*1024;
const MAX_TOTAL=4*1024*1024;

function imageType(bytes:Uint8Array){
 if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)return 'image/jpeg';
 if(bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71)return 'image/png';
 if(new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP')return 'image/webp';
 return '';
}

export async function POST(req:Request){try{
 sameOrigin(req);const contentLength=Number(req.headers.get('content-length')||0);if(contentLength>MAX_TOTAL+100000)return fail(new Error('El conjunto de fotografías supera 4 MB'),413);
 const ip=req.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()||'unknown';const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip+'|'+new Date().toISOString().slice(0,10)));const ipHash=Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,'0')).join('');const since=new Date(Date.now()-3600000).toISOString();const count=await db().prepare('SELECT COUNT(*) AS n FROM machine_offers WHERE ip_hash=? AND created>?').bind(ipHash,since).first<{n:number}>();if((count?.n??0)>=3)return fail(new Error('Has enviado varias valoraciones. Espera una hora o contacta por WhatsApp.'),429);
 const form=await req.formData();const values=Object.fromEntries([...form.entries()].filter(([,v])=>typeof v==='string')) as Record<string,string>;const parsed=machineOfferSchema.safeParse(values);if(!parsed.success)return fail(new Error(parsed.error.issues[0].message));if(parsed.data.website)return fail(new Error('No se ha podido procesar la solicitud'));
 const files=form.getAll('photos').filter((v):v is File=>v instanceof File&&v.size>0);if(!files.length||files.length>8)return fail(new Error('Añade entre 1 y 8 fotografías reales de la máquina'));if(files.reduce((n,f)=>n+f.size,0)>MAX_TOTAL)return fail(new Error('El conjunto de fotografías supera 4 MB'),413);
 const photos:string[]=[];for(const file of files){if(file.size>MAX_FILE||file.size<12)return fail(new Error('Cada fotografía debe ser JPEG, PNG o WebP y pesar menos de 4 MB'));const bytes=new Uint8Array(await file.arrayBuffer());const type=imageType(bytes);if(!type)return fail(new Error('Una fotografía tiene un formato no admitido'));const imageId=crypto.randomUUID();await runtime().BUCKET.put(imageId,bytes,{httpMetadata:{contentType:type}});photos.push('/api/media/'+imageId);}
 const reference='VM-'+parsed.data.id;const {website,privacyAccepted,...clean}=parsed.data;void website;void privacyAccepted;const data={...clean,reference,photos,privacyAccepted:true,privacyVersion:'2026-09-13',notes:''};const settings=await getSettings();await db().prepare('INSERT INTO machine_offers(id,data,status,notification,created,ip_hash) VALUES(?,?,?,?,?,?)').bind(reference,JSON.stringify(data),'Nueva','pending',new Date().toISOString(),ipHash).run();const notification=settings.liveInquiries?await notifyInquiry(reference,data,settings,'Nueva máquina ofrecida'):'demo';await db().prepare('UPDATE machine_offers SET notification=? WHERE id=?').bind(notification,reference).run();
 const summary=`Hola, he enviado la valoración ${reference}. Máquina: ${data.brand} ${data.model}. Modalidad: ${data.operation}.`;return Response.json({reference,notification,whatsappUrl:settings.whatsapp?`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(summary)}`:'',emailUrl:settings.email?`mailto:${settings.email}?subject=${encodeURIComponent('Máquina ofrecida '+reference)}&body=${encodeURIComponent(summary)}`:''},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch(e){console.error('Machine offer failed',e instanceof Error?e.message:'');return fail(new Error('No hemos podido guardar la valoración. Revisa los datos e inténtalo de nuevo.'),503);}}
