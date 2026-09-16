import CatalogApp from '@/app/catalog-app';
import { catalog } from '@/lib/server';
import { notFound } from 'next/navigation';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const m=catalog().machines.find(m=>m.id===id);return {title:m?`${m.brand} ${m.model} · ${m.condition} | El Obrador de Emapan S.L.`:'Máquina no encontrada',description:m?.description};}
export default async function MachinePage({params}:{params:Promise<{id:string}>}){const {id}=await params;const data=catalog();if(!data.machines.some(m=>m.id===id))notFound();return <CatalogApp {...data} mode="detail" initialId={id}/>;}
