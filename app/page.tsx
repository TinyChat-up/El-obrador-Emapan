import CatalogApp from './catalog-app';
import { catalog } from '@/lib/server';
export const dynamic='force-dynamic';
export default function Home(){return <CatalogApp {...catalog()}/>;}
