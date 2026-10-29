import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import {collectionPage as buildSchemaCollectionPage,itemList as buildSchemaItemList} from '@/lib/schema';
import {schemaJson} from '@/lib/schema';
import Link from 'next/link';
import {getIndexableUrls} from '@/lib/seoRoutes';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { articles, articleCategories } from '@/lib/article-catalog';
import { createPageMetadata } from '@/lib/seo';
import styles from '@/app/hubs.module.css';

export const metadata = createPageMetadata({
        title: 'Otomobil Makaleleri ve Araç Rehberleri',
        description: 'OtoSöz makale arşivi: araç alım satımı, bakım ve arıza, sürüş, yakıt, sigorta ve otomobil teknolojisi üzerine seçilmiş rehberleri konularına göre keşfedin.',
        path: '/makale'
    });

export default async function ArticlesPage() {
    const paths=new Set((await getIndexableUrls('makale')).map(entry=>new URL(entry.url).pathname));
    const featuredArticles = articles.filter(article => paths.has(article.path));
    const groups = articleCategories.map(category => ({ ...category,
        articles: featuredArticles.filter(article => article.category === category.slug) })).filter(group => group.articles.length);
    const schema = buildSchemaCollectionPage({'@context': 'https://schema.org',
name: 'OtoSöz Makaleler',
url: 'https://otosoz.com/makale',
inLanguage: 'tr-TR',
mainEntity: buildSchemaItemList({numberOfItems: featuredArticles.length,
itemListElement: groups.flatMap(group => group.articles).map((article, index) => ({
                '@type': 'ListItem', position: index + 1, name: article.title,
                url: `https://otosoz.com${article.path}` }))})});
    return <>
        <Navbar />
        <main className={styles.page}>
<PageBreadcrumbs url={'/makale'}/>

            <div className={styles.container}>

                <header className={styles.hero}>
                    <span className={styles.kicker}>Otomobil bilgi arşivi</span>
                    <h1>Otomobil Makaleleri ve Araç Rehberleri</h1>
                    <p>Araç seçimi, kullanım, bakım ve otomobil dünyası hakkında {featuredArticles.length} makaleyi konu başlıklarına göre inceleyin. Bir rehbere başlamadan önce ilgilendiğiniz bölümü seçebilir, kısa açıklamasını ve belirtilen okuma süresini görebilirsiniz.</p>
                    <div className={styles.stats}><span><strong>{featuredArticles.length}</strong> makale</span><span><strong>{groups.length}</strong> konu grubu</span><Link href="/kutuphane">Bilgi kütüphanesi</Link></div>
                </header>
                <nav className={styles.categories} aria-label="Makale konu grupları">
                    {groups.map(group => <a key={group.slug} href={`#${group.slug}`}>{group.name} ({group.articles.length})</a>)}
                </nav>
                {groups.map(group => <section key={group.slug} id={group.slug} className={styles.articleGroup} aria-labelledby={`${group.slug}-title`}>
                    <div className={styles.sectionHeading}><h2 id={`${group.slug}-title`}>{group.name}</h2><span>{group.articles.length} makale</span></div>
                    <div className={styles.grid}>{group.articles.map(article => <article key={article.id} className={styles.article}>
                        <h3><Link data-article-link href={article.path}>{article.title}</Link></h3>
                        <p>{article.description}</p>
                        {article.minutes ? <span className={styles.meta}>{article.minutes} dakika okuma süresi</span> : null}
                    </article>)}</div>
                </section>)}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(schema) }} />
            </div>
        </main>
        <Footer />
    </>;
}
