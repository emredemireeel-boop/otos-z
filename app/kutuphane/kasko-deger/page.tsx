import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import { indexabilityRobots, isHubIndexable } from '@/lib/indexability';
import { Metadata } from "next";
import KaskoDegerClient from "./KaskoDegerClient";

export const metadata: Metadata = {
    title: 'Kasko Değer Listesi 2026 | Araç Kasko Değeri Sorgulama | OtoSöz',
    description: 'TSB güncel kasko değer listesi 2026. Aracınızın kasko bedelini marka, model ve yıla göre sorgulayın. Fiat Egea, Renault Clio, VW Golf ve tüm araçların kasko değerleri.',
    alternates: { canonical: 'https://otosoz.com/kutuphane/kasko-deger' },
    robots: indexabilityRobots(isHubIndexable('/kutuphane/kasko-deger')),
};

export default function KaskoDegerPage() {
    return <KaskoDegerClient breadcrumbs={<PageBreadcrumbs url="/kutuphane/kasko-deger"/>}/>;
}
