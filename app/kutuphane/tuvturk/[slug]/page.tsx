import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import tuvturkFaq from '@/data/tuvturk_faq.json';
import TuvturkFaqDetailClient from './TuvturkFaqDetailClient';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return tuvturkFaq.map((faq) => ({
        slug: `${faq.slug}--${faq.id}`,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const slugParts = slug.split('--');
    const id = parseInt(slugParts[slugParts.length - 1]);
    const faq = tuvturkFaq.find(f => f.id === id);

    if (!faq) {
        return {
            title: 'Soru Bulunamadı | OtoSöz',
            description: 'Aradığınız TÜVTÜRK sorusu bulunamadı.',
        };
    }

    return {
        title: `${faq.question} | TÜVTÜRK Rehberi | OtoSöz`,
        description: faq.answer.substring(0, 150) + '...',
        keywords: [...faq.tags, "tüvtürk", "araç muayene", "ağır kusur", "hafif kusur"],
        alternates: {
            canonical: `/kutuphane/tuvturk/${slug}`,
        },
        openGraph: {
            title: faq.question,
            description: faq.answer.substring(0, 150) + '...',
            url: `https://otosoz.com/kutuphane/tuvturk/${slug}`,
            type: 'article',
        }
    };
}

export default async function TuvturkFaqPage({ params }: Props) {
    const { slug } = await params;
    const slugParts = slug.split('--');
    const id = parseInt(slugParts[slugParts.length - 1]);
    const faq = tuvturkFaq.find(f => f.id === id);

    if (!faq) {
        notFound();
    }

    return <TuvturkFaqDetailClient faq={faq} />;
}
