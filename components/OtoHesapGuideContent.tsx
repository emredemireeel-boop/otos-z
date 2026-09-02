import Link from "next/link";
import { OTOHESAP_GROUPS, OTOHESAP_GUIDES, OTOHESAP_LAST_REVIEWED } from "@/data/otohesap-content";
import { OTOHESAP_META } from "@/data/otohesap-meta";

interface Props { activeModule: string }

const reviewDate = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
}).format(new Date(`${OTOHESAP_LAST_REVIEWED}T00:00:00Z`));

export default function OtoHesapGuideContent({ activeModule }: Props) {
  const guide = OTOHESAP_GUIDES[activeModule];
  const meta = OTOHESAP_META[activeModule];
  if (!guide || !meta) return null;

  const group = OTOHESAP_GROUPS.find(item => item.modules.some(module => module === activeModule));
  const relatedModules = (group?.modules || []).filter(module => module !== activeModule).slice(0, 4);

  return (
    <section aria-labelledby="otohesap-guide-title" className="oh-guide">
      <div className="oh-guide-panel">
        <span className="oh-category-pill">{guide.category}</span>
        <h2 id="otohesap-guide-title" style={{ marginTop: 12 }}>{guide.h1} nasıl kullanılır?</h2>
        <p style={{ margin: 0, fontSize: 14 }}>{meta.description}</p>
        <ol className="oh-step-grid" style={{ listStyle: "none", padding: 0 }}>
          {guide.steps.map((step, index) => (
            <li key={step} className="oh-step">
              <span className="oh-step-number">{index + 1}</span>{step}
            </li>
          ))}
        </ol>
        {(guide.formula || guide.example) && (
          <div className="oh-formula-grid">
            {guide.formula && <article><span>Hesaplama formülü</span><p>{guide.formula}</p></article>}
            {guide.example && <article><span>Örnek hesap</span><p>{guide.example}</p></article>}
          </div>
        )}
      </div>

      <div className="oh-guide-two-col">
        <article className="oh-guide-card">
          <h3>Sonuç size neyi gösterir?</h3><p>{guide.result}</p>
        </article>
        <article className="oh-guide-card caution">
          <h3>Sonucu değerlendirirken</h3><p>{guide.caution}</p>
        </article>
      </div>

      <div className="oh-guide-panel">
        <h2 style={{ fontSize: 20 }}>Sık sorulan sorular</h2>
        {guide.faqs.map(faq => (
          <details key={faq.question} className="oh-faq-item">
            <summary>{faq.question}</summary><p>{faq.answer}</p>
          </details>
        ))}
      </div>

      {relatedModules.length > 0 && (
        <div className="oh-guide-panel">
          <h2 style={{ fontSize: 20 }}>İlgili OtoHesap araçları</h2>
          <p style={{ margin: "0 0 13px", fontSize: 13 }}>Aynı kararın farklı maliyetlerini birlikte değerlendirin.</p>
          <div className="oh-related-grid">
            {relatedModules.map(module => (
              <Link key={module} href={`/otohesap/${module}`} className="oh-related-link">
                {OTOHESAP_GUIDES[module].label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="oh-review-note">Otosöz içerik ekibi tarafından hazırlanmıştır. Son gözden geçirme: {reviewDate}.</p>
    </section>
  );
}
