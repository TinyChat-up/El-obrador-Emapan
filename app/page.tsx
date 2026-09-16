import CatalogApp from './catalog-app';
import { catalog } from '@/lib/server';
import { demos,defaults } from '@/lib/catalog';
export const dynamic='force-dynamic';
export default async function Home(){try{const data=await catalog();return <CatalogApp {...data}/>;}catch(e){console.error('Catalogue unavailable');return <CatalogApp machines={[]} referenceMachines={demos} settings={defaults} unavailable/>;}}
