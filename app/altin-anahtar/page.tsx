import {createPageMetadata} from '@/lib/seo';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import { indexabilityRobots, isHubIndexable } from '@/lib/indexability';
import { Metadata } from "next";
import AltinAnahtarClient from "./AltinAnahtarClient";

export const metadata: Metadata = createPageMetadata({
        path:"/altin-anahtar",
        title: "Altın Anahtar — Türkiye'nin En İyi Oto Ustaları | OtoSöz",
        description: "Türkiye'nin ilk yıldızlı usta rehberi. Şehir şehir en güvenilir oto tamircileri, motor ustaları, kaportacılar ve elektrikçileri keşfedin. Altın Anahtar derecelendirmesiyle kaliteli hizmet garantisi.",
        index: isHubIndexable('/altin-anahtar')
    });

export default function AltinAnahtarPage() {
    return <AltinAnahtarClient breadcrumbs={<PageBreadcrumbs url={'/altin-anahtar'}/>} />;
}
