import Home from './home';
import { catalog } from '@/lib/server';
export const dynamic='force-dynamic';
export const metadata={alternates:{canonical:'/'}};
export default function Page(){return <Home {...catalog()}/>;}
