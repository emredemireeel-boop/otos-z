import {createPageMetadata} from '@/lib/seo';
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
        return createPageMetadata({
        title: 'Soru Bulunamadı | OtoSöz',
        description: 'Aradığınız TÜVTÜRK sorusu bulunamadı.'
    });
    }

    return createPageMetadata({
        title: `${faq.question} | TÜVTÜRK Rehberi | OtoSöz`,
        description: faq.answer.substring(0, 150) + '...',
        path: `/kutuphane/tuvturk/${slug}`
    });
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
