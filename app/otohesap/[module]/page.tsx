import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OtoHesapClient from '@/components/OtoHesapClient';
import OtoHesapGuideContent from '@/components/OtoHesapGuideContent';
import { OTOHESAP_META } from '@/data/otohesap-meta';
import { OTOHESAP_GUIDES, OTOHESAP_LAST_REVIEWED } from '@/data/otohesap-content';

interface PageProps {
  params: Promise<{
    module: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const meta = OTOHESAP_META[resolvedParams.module];
  if (!meta) {
    return { title: 'OtoHesap | Otosöz' };
  }

  const pageUrl = `https://otosoz.com/otohesap/${resolvedParams.module}`;
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    authors: [{ name: 'Otosöz İçerik Ekibi', url: 'https://otosoz.com/hakkimizda' }],
    creator: 'Otosöz',
    publisher: 'Otosöz',
    category: 'Otomotiv hesaplama araçları',
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    },
    alternates: { canonical: pageUrl },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: pageUrl,
      siteName: 'Otosöz',
      locale: 'tr_TR',
      type: 'website',
      images: [],
    },
    twitter: { card: 'summary', title: meta.title, description: meta.description, images: [] },
  };
}

export function generateStaticParams() {
  return Object.keys(OTOHESAP_META).map(module => ({ module }));
}

export const dynamicParams = false;

export default async function OtoHesapModulePage({ params }: PageProps) {
  const resolvedParams = await params;
  const meta = OTOHESAP_META[resolvedParams.module];
  const guide = OTOHESAP_GUIDES[resolvedParams.module];

  if (!meta || !guide) {
    notFound();
  }

  const pageUrl = `https://otosoz.com/otohesap/${resolvedParams.module}`;
  const applicationCategory = guide.category === 'Teknik hesaplamalar' ? 'UtilitiesApplication' : 'FinanceApplication';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://otosoz.com/' },
          { '@type': 'ListItem', position: 2, name: 'OtoHesap', item: 'https://otosoz.com/otohesap' },
          { '@type': 'ListItem', position: 3, name: guide.label, item: pageUrl },
        ],
      },
      {
        '@type': ['SoftwareApplication', 'WebApplication'],
        '@id': `${pageUrl}#calculator`,
        name: guide.h1,
        description: meta.description,
        url: pageUrl,
        applicationCategory,
        applicationSubCategory: guide.category,
        operatingSystem: 'Web',
        browserRequirements: 'JavaScript destekleyen güncel bir web tarayıcısı',
        inLanguage: 'tr-TR',
        isAccessibleForFree: true,
        dateModified: OTOHESAP_LAST_REVIEWED,
        featureList: guide.steps,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
        provider: { '@type': 'Organization', '@id': 'https://otosoz.com/#organization', name: 'Otosöz', url: 'https://otosoz.com' },
        keywords: meta.keywords,
        potentialAction: { '@type': 'UseAction', target: pageUrl },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: guide.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: meta.title,
        description: meta.description,
        inLanguage: 'tr-TR',
        dateModified: OTOHESAP_LAST_REVIEWED,
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        mainEntity: { '@id': `${pageUrl}#calculator` },
        hasPart: { '@id': `${pageUrl}#faq` },
        isPartOf: { '@id': 'https://otosoz.com/#website' },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <OtoHesapClient activeModule={resolvedParams.module} pageTitle={guide.h1} pageDescription={meta.description}>
        <OtoHesapGuideContent activeModule={resolvedParams.module} />
      </OtoHesapClient>
    </>
  );
}