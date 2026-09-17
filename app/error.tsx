'use client';
import Link from 'next/link';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="empty-state" style={{minHeight:'80vh'}}><h1>No hemos podido cargar esta página.</h1><p>Vuelve a intentarlo en un momento.</p><button className="btn btn-dark" onClick={reset}>Volver a intentar</button><Link href="/" className="text-link">Ir al catálogo</Link></main>}
