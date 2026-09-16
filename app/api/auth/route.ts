import { cookies } from 'next/headers';
import { sameOrigin } from '@/lib/server';
import { supabaseConfig } from '@/lib/supabase';
export async function POST(req:Request){
 try{
  sameOrigin(req);
  const raw=await req.text();if(raw.length>4000)throw new Error('La petición es demasiado larga');
  const {email,password}=JSON.parse(raw);
  if(typeof email!=='string'||typeof password!=='string')throw new Error('Faltan el correo o la contraseña');
  const {url,key}=supabaseConfig();
  const response=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email,password}),cache:'no-store'});
  if(!response.ok){console.error('Supabase login rejected',response.status,(await response.text()).slice(0,300));return Response.json({error:'Correo o contraseña incorrectos. Si has realizado varios intentos, espera unos minutos.'},{status:401});}
  const session=await response.json();
  if(!session.access_token)throw new Error('Supabase no ha devuelto ninguna sesión');
  (await cookies()).set('emapan-session',session.access_token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:session.expires_in});
  return Response.json({ok:true});
 }catch(e){
  // El fallo de configuración se muestra tal cual: no revela ningún secreto y
  // sin él un 400 genérico es imposible de diagnosticar desde el navegador.
  const message=e instanceof Error?e.message:'';
  console.error('Login failed',message||'unknown');
  const setup=message.includes('Supabase')||message.includes('Origen');
  return Response.json({error:setup?message:'No se ha podido iniciar sesión.'},{status:setup?500:400});
 }
}
export async function DELETE(req:Request){sameOrigin(req);(await cookies()).delete('emapan-session');return Response.json({ok:true});}
