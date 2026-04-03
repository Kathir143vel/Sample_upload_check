'use client';
import dynamic from 'next/dynamic';
const FarmMapClient = dynamic(() => import('@/components/FarmMapClient'), { ssr: false });

export default function FarmMapPage() {
  return <FarmMapClient />;
}
