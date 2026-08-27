import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator, CheckCircle2, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { OTOHESAP_META } from '@/data/otohesap-meta';
import { OTOHESAP_GROUPS, OTOHESAP_GUIDES, OTOHESAP_LAST_REVIEWED } from '@/data/otohesap-content';

const PAGE_URL = 'https://otosoz.com/otohesap';
const PAGE_DESCRIPTION = 'Yakıt, MTV, taşıt kredisi, ÖTV muafiyeti, kasko değeri, bakım, elektrikli araç şarjı ve daha fazlası için 16 ücretsiz otomotiv hesaplayıcısı.';

export const metadata: Metadata = {
  title: 'OtoHesap: Araç Maliyeti ve Otomotiv Hesaplama Araçları | OtoSöz',
  description: PAGE_DESCRIPTION,
  keywords: ['otomotiv hesaplama araçları', 'araç maliyeti hesaplama', 'yakıt hesaplama', 'MTV hesaplama 2026', 'taşıt kredisi hesaplama', 'OtoHesap'],
  alternates: { canonical: PAGE_URL },
  authors: [{ name: 'OtoSöz İçerik Ekibi', url: 'https://otosoz.com/hakkimizda' }],
  creator: 'OtoSöz',
  publisher: 'OtoSöz',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' } },
  openGraph: {
    title: 'OtoHesap: Ücretsiz Otomotiv Hesaplama Araçları',
    description: 'Araç alırken ve kullanırken ihtiyaç duyacağınız 16 hesaplayıcı tek merkezde.',
    url: PAGE_URL,
    siteName: 'OtoSöz',
    locale: 'tr_TR',
    type: 'website',
    images: [],
  },
  twitter: {
    card: 'summary',
    title: 'OtoHesap: Ücretsiz Otomotiv Hesaplama Araçları',
    description: 'Yakıt, kredi, vergi, bakım ve araç değeri hesaplamaları tek merkezde.',
    images: [],
  },
};

export default function OtoHesapIndex() {
  const modules = Object.keys(OTOHESAP_META).filter(module => OTOHESAP_GUIDES[module]);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${PAGE_URL}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://otosoz.com/' },
          { '@type': 'ListItem', position: 2, name: 'OtoHesap', item: PAGE_URL },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: 'OtoHesap: Otomotiv Hesaplama Araçları',
        description: PAGE_DESCRIPTION,
        inLanguage: 'tr-TR',
        dateModified: OTOHESAP_LAST_REVIEWED,
        breadcrumb: { '@id': `${PAGE_URL}#breadcrumb` },
        isPartOf: { '@id': 'https://otosoz.com/#website' },
        mainEntity: { '@id': `${PAGE_URL}#tools` },
      },
      {
        '@type': 'ItemList',
        '@id': `${PAGE_URL}#tools`,
        name: 'OtoHesap araçları',
        numberOfItems: modules.length,
        itemListElement: modules.map((module, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: OTOHESAP_GUIDES[module].h1,
          url: `${PAGE_URL}/${module}`,
        })),
      },
    ],
  };

  return (
    <div>
      <Navbar />
      <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

        <section style={{ position: 'relative', overflow: 'hidden', padding: '72px 24px 64px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #2563EB 100%)', color: '#fff' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 75% 20%, rgba(96,165,250,.26), transparent 38%)' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '980px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-grid', placeItems: 'center', width: '66px', height: '66px', borderRadius: '20px', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.16)', marginBottom: '20px' }}>
              <Calculator size={32} />
            </div>
            <h1 style={{ margin: '0 auto 14px', maxWidth: '850px', fontSize: 'clamp(34px, 5vw, 54px)', lineHeight: 1.08, letterSpacing: '-.04em' }}>OtoHesap: Otomotiv hesaplama araçları</h1>
            <p style={{ margin: '0 auto', maxWidth: '760px', color: 'rgba(255,255,255,.74)', fontSize: 'clamp(15px, 2vw, 18px)', lineHeight: 1.7 }}>Araç satın alma kararından günlük kullanım giderlerine kadar yakıt, kredi, vergi, bakım ve değer hesaplarını ücretsiz ve kayıt olmadan yapın.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '26px' }}>
              {['16 ücretsiz hesaplayıcı', '2026 gözden geçirilmiş içerik', 'Kayıt gerektirmez'].map(item => (
                <span key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '999px', background: 'rgba(255,255,255,.09)', border: '1px solid rgba(255,255,255,.13)', color: 'rgba(255,255,255,.86)', fontSize: '12px', fontWeight: 700 }}>
                  <CheckCircle2 size={14} /> {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '38px 20px 76px' }}>
          <nav aria-label="İçerik yolu" style={{ display: 'flex', gap: '7px', marginBottom: '24px', color: 'var(--text-muted)', fontSize: '12px' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Ana Sayfa</Link>
            <span aria-hidden="true">/</span>
            <span style={{ color: 'var(--foreground)', fontWeight: 700 }}>OtoHesap</span>
          </nav>

          {OTOHESAP_GROUPS.map(group => {
            const groupId = `group-${group.title.replaceAll(' ', '-').toLocaleLowerCase('tr-TR')}`;
            return (
              <section key={group.title} aria-labelledby={groupId} style={{ marginBottom: '42px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h2 id={groupId} style={{ margin: '0 0 5px', color: 'var(--foreground)', fontSize: '26px', letterSpacing: '-.02em' }}>{group.title}</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.65 }}>{group.description}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  {group.modules.map(module => {
                    const guide = OTOHESAP_GUIDES[module];
                    const meta = OTOHESAP_META[module];
                    return (
                      <Link key={module} href={`/otohesap/${module}`} style={{ display: 'flex', flexDirection: 'column', minHeight: '205px', padding: '22px', borderRadius: '17px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', textDecoration: 'none', boxShadow: '0 8px 26px rgba(15,23,42,.04)' }}>
                        <span style={{ color: '#2563EB', fontSize: '10px', fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '9px' }}>{guide.category}</span>
                        <h3 style={{ margin: '0 0 8px', color: 'var(--foreground)', fontSize: '17px', lineHeight: 1.4 }}>{guide.label}</h3>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{meta.description}</p>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: 'auto', paddingTop: '16px', color: '#2563EB', fontSize: '12px', fontWeight: 800 }}>Hesaplayıcıyı aç <ArrowRight size={14} /></span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'stretch' }}>
            <div style={{ padding: '28px', borderRadius: '18px', background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <h2 style={{ margin: '0 0 10px', color: 'var(--foreground)', fontSize: '24px' }}>OtoHesap sonuçları nasıl kullanılmalı?</h2>
              <p style={{ margin: '0 0 12px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.75 }}>Hesaplayıcılar farklı seçenekleri aynı ölçekte görmenize ve bütçe oluşturmanıza yardımcı olur. Sonuçlar girilen bilgilere dayalı tahminlerdir; banka teklifi, vergi borcu, sigorta bedeli veya resmî ekspertiz yerine geçmez.</p>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.75 }}>Finansal veya mevzuata bağlı bir işlemden önce ilgili banka, sigorta şirketi ya da resmî kurumun güncel belgesini kontrol edin.</p>
            </div>
            <div style={{ padding: '28px', borderRadius: '18px', background: 'linear-gradient(145deg, rgba(37,99,235,.12), rgba(37,99,235,.03))', border: '1px solid rgba(37,99,235,.22)' }}>
              <ShieldCheck size={28} color="#2563EB" />
              <h2 style={{ margin: '14px 0 8px', color: 'var(--foreground)', fontSize: '21px' }}>Şeffaf hesaplama yaklaşımı</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7 }}>Her araç hangi veriyi kullandığını ve sonucun hangi koşullarda değişebileceğini açıklar. Son gözden geçirme: 26 Ağustos 2026.</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}