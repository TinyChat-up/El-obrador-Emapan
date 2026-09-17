import CatalogApp from './catalog-app';
import { catalog } from '@/lib/server';
export const dynamic='force-dynamic';
export const metadata={alternates:{canonical:'/'}};
export default function Home(){return <CatalogApp {...catalog()}/>;}
