import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OtoHesapClient from '@/components/OtoHesapClient';
import { OTOHESAP_META } from '@/data/otohesap-meta';

interface PageProps {
  params: Promise<{
    module: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const meta = OTOHESAP_META[resolvedParams.module];
  if (!meta) {
    return { title: 'OtoHesap | OtoSöz' };
  }
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
  };
}

export default async function OtoHesapModulePage({ params }: PageProps) {
  const resolvedParams = await params;
  const meta = OTOHESAP_META[resolvedParams.module];
  
  if (!meta) {
    notFound();
  }

  return <OtoHesapClient activeModule={resolvedParams.module} />;
}
