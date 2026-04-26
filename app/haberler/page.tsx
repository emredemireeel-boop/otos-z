import { Metadata } from "next";
import HaberlerClient from "./HaberlerClient";

export const metadata: Metadata = {
    title: 'OtoSöz Haberler | Güncel Otomobil Haberleri ve Rehberler',
    description: 'Otomotiv dünyasından en güncel gelişmeler, yasal düzenlemeler, vergi oranları, bakım tavsiyeleri ve uzman sürüş rehberleri.',
    openGraph: {
        title: 'OtoSöz Haberler | Güncel Otomobil Haberleri',
        description: 'Otomotiv dünyasından en güncel gelişmeler, yasal düzenlemeler, bakım tavsiyeleri ve sürüş rehberleri.',
        type: 'website',
        url: 'https://www.otosoz.com/haberler',
        images: [
            {
                url: `/api/og?title=${encodeURIComponent('OtoSöz Haberler')}&desc=${encodeURIComponent('Otomotiv dünyasından en güncel gelişmeler.')}`,
                width: 1200,
                height: 630,
                alt: 'OtoSöz Haberler',
            }
        ],
    },
    alternates: {
        canonical: 'https://www.otosoz.com/haberler',
    },
};

export default function HaberlerServerPage() {
    return <HaberlerClient />;
}
