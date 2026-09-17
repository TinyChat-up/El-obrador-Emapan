import CompareApp from './compare-app';
import { catalog } from '@/lib/server';
export const dynamic='force-dynamic';
export const metadata={title:'Comparar maquinaria de segunda mano con modelos nuevos',description:'Compara una máquina de segunda mano revisada en taller con modelos nuevos de panadería, pastelería y heladería: precio, capacidad, estado y garantía.',alternates:{canonical:'/comparar'}};
export default async function ComparePage({searchParams}:{searchParams:Promise<{ids?:string}>}){const {ids}=await searchParams;const data=catalog();const known=[...data.machines,...data.referenceMachines];const valid=[...new Set((typeof ids==='string'?ids:'').split(','))].filter(id=>known.some(m=>m.id===id)).slice(0,3);return <CompareApp {...data} initialCompare={valid}/>;}
