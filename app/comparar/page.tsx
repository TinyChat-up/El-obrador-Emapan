import type { Metadata } from 'next';
import CompareApp from './compare-app';
import { catalog } from '@/lib/server';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Comparador: maquinaria de segunda mano frente a nueva',
  description: 'Compara cara a cara una máquina de segunda mano revisada en taller con modelos nuevos de panadería, pastelería y heladería: precio, estado, garantía y ficha técnica.',
  alternates: { canonical: '/comparar' },
};

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const { ids } = await searchParams;
  const data = catalog();
  const requested = (typeof ids === 'string' ? ids : '').split(',').filter(Boolean);
  return <CompareApp {...data} initialCompare={requested} />;
}
