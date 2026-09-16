import CatalogApp from '@/app/catalog-app';
import { safeCatalog } from '@/lib/server';
import { notFound } from 'next/navigation';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const {machines}=await safeCatalog();const m=machines.find(m=>m.id===id);return {title:m?`${m.brand} ${m.model} · ${m.condition} | El Obrador de Emapan S.L.`:'Máquina no encontrada',description:m?.description};}
// Si el inventario no carga no podemos afirmar que la máquina no exista, así
// que se muestra el aviso del catálogo en lugar de un 404 engañoso.
export default async function MachinePage({params}:{params:Promise<{id:string}>}){const {id}=await params;const data=await safeCatalog();if(data.unavailable)return <CatalogApp {...data}/>;if(!data.machines.some(m=>m.id===id))notFound();return <CatalogApp {...data} mode="detail" initialId={id}/>;}
