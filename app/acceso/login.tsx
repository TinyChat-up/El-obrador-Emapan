 'use client';
import { useState } from 'react';
export default function Login(){
 const [error,setError]=useState(''),[busy,setBusy]=useState(false);
 return <form onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');const form=new FormData(e.currentTarget);try{const r=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:form.get('email'),password:form.get('password')})});const data=await r.json();if(!r.ok)throw new Error(data.error);window.location.assign('/gestion');}catch(e){setError(e instanceof Error?e.message:'No se ha podido entrar');setBusy(false);}}}><label>Correo electrónico<input name="email" type="email" autoComplete="username" required/></label><label>Contraseña<input name="password" type="password" autoComplete="current-password" required/></label>{error&&<p role="alert">{error}</p>}<button className="btn btn-dark full" disabled={busy}>{busy?'Entrando…':'Entrar en la gestión'}</button></form>;
}
