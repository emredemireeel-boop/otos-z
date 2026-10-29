import {schemaJson} from '@/lib/schema';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getObdDirectoryPage, obdDirectoryPageCount, OBD_DIRECTORY_PAGE_SIZE } from '@/lib/obd-catalog';
import { indexabilityRobots, isGuideIndexable } from '@/lib/indexability';

const BASE_URL = 'https://otosoz.com';
export const dynamicParams = false;
type Props = { params: Promise<{ page: string }> };

export function generateStaticParams() {
    return Array.from({ length: obdDirectoryPageCount }, (_, index) => ({ page: String(index + 1) }));
}

function parsePage(value: string) {
    if (!/^\d+$/.test(value)) return null;
    const page = Number(value);
    return Number.isSafeInteger(page) && page >= 1 && page <= obdDirectoryPageCount ? page : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { page: rawPage } = await params;
    const page = parsePage(rawPage);
    if (!page) return { title: 'OBD kod dizini bulunamadı | OtoSöz', robots: { index: false, follow: false } };
    const url = `${BASE_URL}/obd-kodlari/${page}`;
    return {
        title: `Evrensel OBD-II Arıza Kodları Dizini – Sayfa ${page} | OtoSöz`,
        description: `P, B, C ve U tipi OBD-II arıza kodlarını alfabetik sırayla inceleyin. OBD kod dizini sayfa ${page}.`,
        alternates: { canonical: url },
        robots: indexabilityRobots(isGuideIndexable({ title: 'OBD kullanıcı kataloğu' }, { kind: 'utility-template' })),
        openGraph: { title: `Evrensel OBD-II Kod Dizini – Sayfa ${page}`, description: 'Türkçe OBD-II arıza kodu açıklamalarına ulaşın.', url, type: 'website' },
    };
}

export default async function ObdDirectoryPage({ params }: Props) {
    const { page: rawPage } = await params;
    const page = parsePage(rawPage);
    if (!page) notFound();
    const codes = getObdDirectoryPage(page);
    const first = (page - 1) * OBD_DIRECTORY_PAGE_SIZE + 1;
    const last = first + codes.length - 1;
    const canonicalUrl = `${BASE_URL}/obd-kodlari/${page}`;
    const schema = {
        '@context': 'https://schema.org', '@type': 'ItemList',
        name: `Evrensel OBD-II arıza kodları dizini – Sayfa ${page}`, url: canonicalUrl,
        numberOfItems: codes.length,
        itemListElement: codes.map((code, index) => ({ '@type': 'ListItem', position: first + index, name: `${code.code} – ${code.title}`, url: `${BASE_URL}/obd/${code.code.toLowerCase()}` })),
    };
    return <>
        <Navbar />
        <main style={{ minHeight: '100vh', background: 'var(--background)', padding: '36px 24px 64px' }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(schema) }} />
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <nav style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}><Link href="/obd" style={{ color: 'var(--primary)' }}>OBD Arıza Kodları</Link> / Kod dizini / {page}</nav>
                <h1 style={{ color: 'var(--foreground)', fontSize: 'clamp(24px, 4vw, 38px)', marginBottom: 10 }}>OBD-II arıza kodları dizini</h1>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28 }}>{first}–{last} arasındaki kodlar · Sayfa {page}/{obdDirectoryPageCount}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                    {codes.map(code => <Link key={code.code} href={`/obd/${code.code.toLowerCase()}`} style={{ display: 'block', padding: 16, borderRadius: 12, border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--foreground)', textDecoration: 'none' }}>
                        <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{code.code}</strong>
                        <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.5, marginTop: 6 }}>{code.title}</span>
                    </Link>)}
                </div>
                <nav aria-label="OBD dizin sayfaları" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 28 }}>
                    {page > 1 ? <Link href={`/obd-kodlari/${page - 1}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>← Önceki sayfa</Link> : <span />}
                    {page < obdDirectoryPageCount ? <Link href={`/obd-kodlari/${page + 1}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>Sonraki sayfa →</Link> : <span />}
                </nav>
            </div>
        </main>
        <Footer />
    </>;
}
