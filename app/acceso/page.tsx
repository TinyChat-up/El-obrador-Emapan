import Login from './login';
import { ArrowUpRight,KeyRound,ShieldCheck } from 'lucide-react';
import { Footer,Header } from '@/app/catalog-app';
import { signOutPath,getUser } from '@/lib/auth';
import { defaults } from '@/lib/catalog';

export const dynamic='force-dynamic';
export const metadata={title:'Acceso profesional | El Obrador de Emapan S.L.',robots:{index:false,follow:false}};

export default async function AccessPage(){
 const user=await getUser();
 return <><Header brand={defaults.brand}/><main className="login-page wrap"><section className="login-card"><div className="login-icon"><KeyRound size={27}/></div><span className="eyebrow">GESTIÓN PRIVADA</span><h1>Tu inventario,<br/>siempre al día.</h1><p>Sube las fotografías reales de cada máquina, completa su revisión, cambia precios y disponibilidad y publica solo cuando la ficha esté lista.</p>{user?<div className="login-actions"><div className="signed-in"><ShieldCheck size={18}/><span>Sesión iniciada como <strong>{user.email}</strong></span></div><a className="btn btn-dark full" href="/gestion">Entrar en la gestión <ArrowUpRight size={17}/></a><a className="text-link" href={signOutPath('/acceso')} target="_top">Cerrar sesión o cambiar de cuenta</a></div>:<div className="login-actions"><Login/><small>Accede con la cuenta propietaria creada en Supabase.</small></div>}</section><aside className="login-benefits"><div><span>01</span><h2>Publica sin tocar código</h2><p>Fotos, precio, estado técnico, garantía y disponibilidad desde un formulario.</p></div><div><span>02</span><h2>Comparación automática</h2><p>Relaciona la unidad usada con su modelo nuevo y la plataforma prepara la tabla sola.</p></div><div><span>03</span><h2>Solicitudes ordenadas</h2><p>Las consultas quedan guardadas con la máquina que interesó al cliente.</p></div></aside></main><Footer settings={defaults}/></>;
}
