import { requireUser,signOutPath } from '@/lib/auth';
import { owner,db } from '@/lib/server';
import Admin from './panel';

export const dynamic='force-dynamic';
export const metadata={title:'Gestión privada | El Obrador de Emapan S.L.',robots:{index:false,follow:false}};
export default async function Management(){
 const user=await requireUser('/gestion');
 try{await owner();return <Admin/>;}catch{}
 let activated;
 try{activated=await db().prepare('SELECT user_id FROM admins WHERE id=2').first();}catch{return <main className="empty-state"><h1>No podemos cargar la gestión.</h1><p>Vuelve a intentarlo en unos minutos. Tus datos se conservan.</p><a href="/gestion">Reintentar</a></main>;}
 return <main className="wrap login-page"><section className="login-card"><a href="/" className="eyebrow">EL OBRADOR / EMAPAN</a><h1>{activated?'Gestión privada.':'Activa tu obrador.'}</h1><p>Sesión iniciada como <strong>{user.email}</strong>.</p>{!activated?<p>Configura esta cuenta como administradora en Supabase siguiendo DESPLIEGUE.md.</p>:<p>Accede con la cuenta propietaria vinculada a la administración.</p>}<a className="text-link" href={signOutPath('/acceso')} target="_top">Cerrar sesión o cambiar de cuenta</a></section></main>;
}
