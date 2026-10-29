import {createPageMetadata} from '@/lib/seo';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import {faqPage as buildSchemaFAQPage,breadcrumb as buildSchemaBreadcrumbList} from '@/lib/schema';
import {schemaJson} from '@/lib/schema';
import { indexabilityRobots, isGuideIndexable, qualityContentText } from '@/lib/indexability';
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
    return createPageMetadata({
        title: 'OtoHesap | Otosöz'
    });
  }

  const pageUrl = `https://otosoz.com/otohesap/${resolvedParams.module}`;
  return createPageMetadata({
        title: meta.title,
        description: meta.description,
        category: 'Otomotiv hesaplama araçları',
        path: pageUrl,
        index: isGuideIndexable(meta, { kind: 'functional-utility', text: qualityContentText(OTOHESAP_GUIDES[resolvedParams.module]) })
    });
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
      buildSchemaBreadcrumbList({'@id': `${pageUrl}#breadcrumb`,
itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://otosoz.com/' },
          { '@type': 'ListItem', position: 2, name: 'OtoHesap', item: 'https://otosoz.com/otohesap' },
          { '@type': 'ListItem', position: 3, name: guide.label, item: pageUrl },
        ]}),
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
      buildSchemaFAQPage({'@id': `${pageUrl}#faq`,
mainEntity: guide.faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        }))}),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(jsonLd) }} />
      <OtoHesapClient breadcrumbs={<PageBreadcrumbs url={pageUrl}/>} activeModule={resolvedParams.module} pageTitle={guide.h1} pageDescription={meta.description}>
        <OtoHesapGuideContent activeModule={resolvedParams.module} />
      </OtoHesapClient>
    </>
  );
}
