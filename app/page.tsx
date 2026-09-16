import CatalogApp from './catalog-app';
import { safeCatalog } from '@/lib/server';
export const dynamic='force-dynamic';
export default async function Home(){const data=await safeCatalog();return <CatalogApp {...data}/>;}
