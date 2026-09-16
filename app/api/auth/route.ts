import { cookies } from 'next/headers';
import { sameOrigin } from '@/lib/server';
import { supabaseConfig } from '@/lib/supabase';
export async function POST(req:Request){
 try{
  sameOrigin(req);
  const raw=await req.text();if(raw.length>4000)throw new Error();
  const {email,password}=JSON.parse(raw);
  if(typeof email!=='string'||typeof password!=='string')throw new Error();
  const {url,key}=supabaseConfig();
  const response=await fetch(`${url}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email,password}),cache:'no-store'});
  if(!response.ok)return Response.json({error:'Correo o contraseña incorrectos. Si has realizado varios intentos, espera unos minutos.'},{status:401});
  const session=await response.json();
  (await cookies()).set('emapan-session',session.access_token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:session.expires_in});
  return Response.json({ok:true});
 }catch{return Response.json({error:'No se ha podido iniciar sesión.'},{status:400});}
}
export async function DELETE(req:Request){sameOrigin(req);(await cookies()).delete('emapan-session');return Response.json({ok:true});}
