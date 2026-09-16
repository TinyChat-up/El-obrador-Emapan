 'use client';
export default function Logout(){return <main className="wrap login-page"><button className="btn btn-dark" onClick={async()=>{const r=await fetch('/api/auth',{method:'DELETE'});if(r.ok)window.location.assign('/acceso');}}>Cerrar sesión</button></main>;}
