import Link from 'next/link';
import { OTOHESAP_GROUPS, OTOHESAP_GUIDES, OTOHESAP_LAST_REVIEWED } from '@/data/otohesap-content';
import { OTOHESAP_META } from '@/data/otohesap-meta';

interface OtoHesapSeoContentProps {
  activeModule: string;
}

const reviewDate = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(`${OTOHESAP_LAST_REVIEWED}T00:00:00Z`));

export default function OtoHesapSeoContent({ activeModule }: OtoHesapSeoContentProps) {
  const guide = OTOHESAP_GUIDES[activeModule];
  const meta = OTOHESAP_META[activeModule];
  if (!guide || !meta) return null;

  const group = OTOHESAP_GROUPS.find(item => item.modules.some(module => module === activeModule));
  const relatedModules = (group?.modules || [])
    .filter(module => module !== activeModule)
    .slice(0, 4);

  return (
    <section aria-labelledby="otohesap-guide-title" style={{ maxWidth: '920px', margin: '0 auto', padding: '8px 20px 72px' }}>
      <nav aria-label="İçerik yolu" style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap', marginBottom: '18px', color: 'var(--text-muted)', fontSize: '12px' }}>
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Ana Sayfa</Link>
        <span aria-hidden="true">/</span>
        <Link href="/otohesap" style={{ color: 'inherit', textDecoration: 'none' }}>OtoHesap</Link>
        <span aria-hidden="true">/</span>
        <span style={{ color: 'var(--foreground)', fontWeight: 700 }}>{guide.label}</span>
      </nav>

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '18px', padding: 'clamp(22px, 4vw, 34px)', marginBottom: '18px' }}>
        <span style={{ display: 'inline-flex', padding: '5px 9px', borderRadius: '999px', background: 'rgba(37,99,235,.1)', color: '#2563EB', fontSize: '11px', fontWeight: 800, marginBottom: '12px' }}>{guide.category}</span>
        <h2 id="otohesap-guide-title" style={{ margin: '0 0 10px', color: 'var(--foreground)', fontSize: 'clamp(22px, 3vw, 30px)', lineHeight: 1.25 }}>{guide.h1} nasıl kullanılır?</h2>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.75 }}>{meta.description}</p>

        <ol style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', listStyle: 'none', padding: 0, margin: '24px 0 0', counterReset: 'step' }}>
          {guide.steps.map((step, index) => (
            <li key={step} style={{ padding: '16px', borderRadius: '13px', background: 'var(--secondary)', border: '1px solid var(--card-border)' }}>
              <span style={{ display: 'grid', placeItems: 'center', width: '28px', height: '28px', borderRadius: '9px', background: '#2563EB', color: '#fff', fontSize: '12px', fontWeight: 800, marginBottom: '10px' }}>{index + 1}</span>
              <span style={{ color: 'var(--foreground)', fontSize: '13px', fontWeight: 650, lineHeight: 1.55 }}>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '18px' }}>
        <article style={{ padding: '20px', borderRadius: '16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <h3 style={{ margin: '0 0 8px', color: 'var(--foreground)', fontSize: '16px' }}>Hesaplama sonucu neyi gösterir?</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7 }}>{guide.result}</p>
        </article>
        <article style={{ padding: '20px', borderRadius: '16px', background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.24)' }}>
          <h3 style={{ margin: '0 0 8px', color: 'var(--foreground)', fontSize: '16px' }}>Sonucu değerlendirirken</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7 }}>{guide.caution}</p>
        </article>
      </div>

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '18px', padding: '24px', marginBottom: '18px' }}>
        <h2 style={{ margin: '0 0 14px', color: 'var(--foreground)', fontSize: '21px' }}>Sık sorulan sorular</h2>
        {guide.faqs.map((faq) => (
          <details key={faq.question} style={{ padding: '14px 0', borderTop: '1px solid var(--card-border)' }}>
            <summary style={{ color: 'var(--foreground)', fontSize: '14px', fontWeight: 750, cursor: 'pointer' }}>{faq.question}</summary>
            <p style={{ margin: '9px 0 0', color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7 }}>{faq.answer}</p>
          </details>
        ))}
      </div>

      {relatedModules.length > 0 && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '18px', padding: '24px' }}>
          <h2 style={{ margin: '0 0 6px', color: 'var(--foreground)', fontSize: '21px' }}>İlgili OtoHesap araçları</h2>
          <p style={{ margin: '0 0 14px', color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6 }}>Aynı kararın farklı maliyetlerini birlikte değerlendirin.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
            {relatedModules.map(module => {
              const related = OTOHESAP_GUIDES[module];
              return (
                <Link key={module} href={`/otohesap/${module}`} style={{ padding: '13px 14px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--secondary)', color: 'var(--foreground)', fontSize: '13px', fontWeight: 750, lineHeight: 1.45, textDecoration: 'none' }}>
                  {related.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <p style={{ margin: '16px 4px 0', color: 'var(--text-subtle)', fontSize: '11px', lineHeight: 1.6 }}>
        OtoSöz içerik ekibi tarafından kullanıcıların otomobil maliyetlerini daha şeffaf değerlendirebilmesi için hazırlanmıştır. Son gözden geçirme: {reviewDate}.
      </p>
    </section>
  );
}
