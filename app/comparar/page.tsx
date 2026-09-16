import CatalogApp from '@/app/catalog-app';
import { catalog } from '@/lib/server';
export const dynamic='force-dynamic';
export const metadata={title:'Compara maquinaria nueva y reacondicionada | El Obrador de Emapan S.L.'};
export default async function ComparePage({searchParams}:{searchParams:Promise<{ids?:string}>}){const {ids}=await searchParams;const data=catalog();const known=[...data.machines,...data.referenceMachines];const valid=[...new Set((typeof ids==='string'?ids:'').split(','))].filter(id=>known.some(m=>m.id===id)).slice(0,3);return <CatalogApp {...data} mode="compare" initialCompare={valid}/>;}
