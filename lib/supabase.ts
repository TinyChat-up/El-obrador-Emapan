export function supabaseConfig() {
 // trim(): al pegar valores en Vercel es fácil arrastrar un salto de línea.
 const url=process.env.SUPABASE_URL?.trim();
 const key=process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
 if(!url||!key)throw new Error('Falta configurar Supabase: '+[!url&&'SUPABASE_URL',!key&&'SUPABASE_SERVICE_ROLE_KEY'].filter(Boolean).join(' y ')+' no tiene valor en este despliegue');
 return {url:url.replace(/\/$/,''),key};
}
export const storage={
 async put(id:string,bytes:Uint8Array,options:{httpMetadata:{contentType:string}}){
  const {url,key}=supabaseConfig();
  const result=await fetch(`${url}/storage/v1/object/machine-images/${id}`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':options.httpMetadata.contentType},body:Buffer.from(bytes)});
  if(!result.ok)throw new Error('No se ha podido guardar la fotografía');
 },
 async get(id:string){
  const {url,key}=supabaseConfig();
  const result=await fetch(`${url}/storage/v1/object/authenticated/machine-images/${id}`,{headers:{apikey:key,Authorization:`Bearer ${key}`},cache:'no-store'});
  if(result.status===404)return null;
  if(!result.ok)throw new Error('No se ha podido leer la fotografía');
  return {body:result.body,httpMetadata:{contentType:result.headers.get('content-type')??'image/jpeg'}};
 }
};
