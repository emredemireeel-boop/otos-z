import {schemaJson} from '@/lib/schema';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getForumHubThreadSummaries } from '@/lib/forumDataServer';
import { forumCategories, forumHubPath, FORUM_PAGE_SIZE } from '@/lib/forum-hub';
import { forumPageWindow, isForumCategoryIndexable } from '@/lib/forum-pagination';
import { createPageMetadata } from '@/lib/seo';
import styles from '@/app/hubs.module.css';

export async function getForumHubData(page = 1, categorySlug?: string) {
    const category = categorySlug ? forumCategories.find(item => item.slug === categorySlug) : null;
    if (categorySlug && !category) notFound();
    const threads = await getForumHubThreadSummaries(category?.name || null);
    const window = forumPageWindow(threads.length, page);
    if (!window) notFound();
    return { category, threads, pages: window.pages, page,
        visible: threads.slice(window.start, window.end),
        indexable: category ? isForumCategoryIndexable(threads.length) : true };
}

export async function forumHubMetadata(page = 1, categorySlug?: string) {
    const data = await getForumHubData(page, categorySlug);
    const title = data.category
        ? `${data.category.name} Forum Başlıkları${page > 1 ? ` — Sayfa ${page}` : ''}`
        : `OtoSöz Forum — Otomobil Soru ve Tartışmaları${page > 1 ? ` — Sayfa ${page}` : ''}`;
    return { ...createPageMetadata({ title,
        description: data.category
            ? `${data.category.name} hakkında OtoSöz topluluğundaki ${data.threads.length} görünür başlığı, son yanıtları ve sürücü deneyimlerini inceleyin.`
            : 'Otomobil arızaları, bakım, ikinci el alım satım ve sürücü deneyimleri hakkında gerçek forum başlıkları. Kategorilere göz atın, soruları ve yanıtları okuyun.',
        path: forumHubPath(page, categorySlug) }),
        robots: { index: data.indexable, follow: true,
            googleBot: { index: data.indexable, follow: true } } };
}

const date = (value: number) => new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul',
}).format(value);

export default async function ForumHub({ page = 1, categorySlug }: { page?: number; categorySlug?: string }) {
    const data = await getForumHubData(page, categorySlug);
    const allThreads = categorySlug ? await getForumHubThreadSummaries(null) : data.threads;
    const path = forumHubPath(page, categorySlug);
    const schema = { '@context': 'https://schema.org', '@type': 'CollectionPage',
        name: data.category ? `${data.category.name} forum başlıkları` : 'OtoSöz Forum',
        url: `https://otosoz.com${path}`, inLanguage: 'tr-TR',
        mainEntity: { '@type': 'ItemList', numberOfItems: data.visible.length,
            itemListElement: data.visible.map((thread, index) => ({ '@type': 'ListItem',
                position: (page - 1) * FORUM_PAGE_SIZE + index + 1,
                name: thread.title, url: `https://otosoz.com/forum/${thread.slug}` })) } };
    return <>
        <Navbar />
        <main className={styles.page}>
            <div className={styles.container}>
                <nav className={styles.breadcrumb} aria-label="İçerik yolu">
                    <Link href="/">Ana sayfa</Link><span aria-hidden="true">/</span>
                    {categorySlug ? <><Link href="/forum">Forum</Link><span aria-hidden="true">/</span></> : null}
                    <span aria-current="page">{data.category?.name || 'Forum'}</span>
                </nav>
                <header className={styles.hero}>
                    <span className={styles.kicker}>OtoSöz topluluğu</span>
                    <h1>{data.category ? `${data.category.name} — Forum Başlıkları` : 'OtoSöz Forum — Otomobil Soru ve Tartışmaları'}{page > 1 ? ` — Sayfa ${page}` : ''}</h1>
                    <p>Bir otomobil almadan önce araştırma yapanların, araç bakımını planlayanların ve yaşadığı sorunu başka sürücülerle konuşmak isteyenlerin buluşma alanı. Başlıkları kategoriye göre inceleyin; sorunun hangi araçta ve hangi koşullarda görüldüğünü, diğer üyelerin hangi kontrolleri önerdiğini okuyun.</p>
                    <div className={styles.stats}>
                        <span><strong>{data.threads.length}</strong> görünür başlık</span>
                        <span><strong>{data.threads.reduce((count, thread) => count + thread.entryCount, 0)}</strong> ileti</span>
                        <Link href="/forum/feed.xml">Son başlıklar RSS</Link>
                    </div>
                </header>
                <nav className={styles.categories} aria-label="Forum kategorileri">
                    <Link href="/forum" aria-current={!categorySlug ? 'page' : undefined}>Tüm başlıklar ({allThreads.length})</Link>
                    {forumCategories.map(category => <Link key={category.slug}
                        href={forumHubPath(1, category.slug)} aria-current={category.slug === categorySlug ? 'page' : undefined}>
                        {category.name} ({allThreads.filter(thread => thread.category === category.name).length})
                    </Link>)}
                </nav>
                <section aria-labelledby="forum-topics">
                    <div className={styles.sectionHeading}><h2 id="forum-topics">{data.category ? `${data.category.name} başlıkları` : 'Son konuşulan başlıklar'}</h2>
                        <span>Sayfa {page} / {data.pages}</span></div>
                    <ol className={styles.list} start={(page - 1) * FORUM_PAGE_SIZE + 1}>
                        {data.visible.map(thread => <li key={thread.id} className={styles.thread}>
                            <span className={styles.tag}>{thread.category}</span>
                            <h3><Link data-forum-thread href={`/forum/${thread.slug}`}>{thread.title}</Link></h3>
                            {thread.description ? <p>{thread.description}</p> : null}
                            <div className={styles.meta}><span>{thread.entryCount} ileti · {Math.max(0, thread.entryCount - 1)} yanıt</span>
                                {thread.lastEntryAt || thread.createdAt ? <span>Son ileti: <time dateTime={new Date(thread.lastEntryAt || thread.createdAt!).toISOString()}>{date(thread.lastEntryAt || thread.createdAt!)}</time></span> : <span>İleti tarihi belirtilmemiş</span>}
                            </div>
                        </li>)}
                    </ol>
                    {!data.visible.length ? <p>Bu kategoride henüz görünür başlık yok. Diğer kategorilerdeki konuşmalara <Link href="/forum">forum merkezinden</Link> ulaşabilirsiniz.</p> : null}
                </section>
                {data.pages > 1 ? <nav className={styles.pagination} aria-label="Forum sayfaları">
                    {page > 1 ? <Link rel="prev" href={forumHubPath(page - 1, categorySlug)}>Önceki</Link> : null}
                    <span aria-current="page">{page} / {data.pages}</span>
                    {page < data.pages ? <Link rel="next" href={forumHubPath(page + 1, categorySlug)}>Sonraki</Link> : null}
                </nav> : null}
                <section className={styles.intro} aria-labelledby="forum-guide">
                    <h2 id="forum-guide">Başlıklarda ne bulabilirsiniz?</h2>
                    <p>Teknik ve arıza konuşmalarında motor, şanzıman, elektrik ve gösterge uyarıları ele alınır. Bakım konularında değişim zamanları, servis işlemleri ve bakım geçmişi tartışılır. Alım satım başlıkları araç araştırması, ekspertiz ve kullanım ihtiyacına göre seçenekleri değerlendirmek içindir. Deneyim bölümünde sürücülerin günlük kullanım gözlemlerini ve kendi araçlarıyla ilgili paylaşımlarını okuyabilirsiniz.</p>
                    <p>Bir başlığı değerlendirirken marka, model, üretim yılı, motor, kilometre ve bakım geçmişini birlikte düşünün. Aynı belirti farklı araçlarda farklı nedenlerden kaynaklanabilir. Paylaşımları okurken önerilen işlemin hangi bulguyla desteklendiğine, işlemin sonucunun yazılıp yazılmadığına ve benzer araçlardan yanıt gelip gelmediğine bakın.</p>
                    <h2>Sorunuzu anlaşılır biçimde paylaşın</h2>
                    <p>Yeni bir soru hazırlarken önce benzer başlıkları okuyun. Belirtinin ne zaman başladığını, soğuk veya sıcak motorda görülüp görülmediğini, ekrandaki uyarıyı ve yakın zamanda yapılan işlemleri yazın. Arıza kodu varsa kodu eksiksiz belirtin. Araştırmanız ilerledikçe yaptığınız kontrolleri ve elde ettiğiniz sonucu aynı başlığa ekleyin; sonraki okuyucular da çözümün hangi araçta işe yaradığını takip edebilsin.</p>
                    <p>Teknik terimleri kontrol etmek için <Link href="/kutuphane">bilgi kütüphanesine</Link>, kod açıklamaları için <Link href="/obd">OBD merkezine</Link>, model ve motor seçenekleri için <Link href="/arac-dna">Araç DNA sayfalarına</Link> bakabilirsiniz. Uzun rehberleri <Link href="/makale">Makaleler</Link> bölümünde bulabilirsiniz. Konuşmalara katılmak için <Link href="/giris">hesabınıza giriş yapın</Link>.</p>
                </section>
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(schema) }} />
            </div>
        </main>
        <Footer />
    </>;
}
