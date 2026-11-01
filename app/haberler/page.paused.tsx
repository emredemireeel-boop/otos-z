import {createPageMetadata} from '@/lib/seo';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import { indexabilityRobots, isHubIndexable } from '@/lib/indexability';
import { Metadata } from "next";
import HaberlerClient from "./HaberlerClient";
import newsData from "@/public/data/news_posts.json";

export const metadata: Metadata = createPageMetadata({
        path:"/haberler",
        title: 'OtoSöz Haberler | Güncel Otomobil Haberleri ve Rehberler',
        description: 'Otomotiv dünyasından en güncel gelişmeler, yasal düzenlemeler, vergi oranları, bakım tavsiyeleri ve uzman sürüş rehberleri.',
        index: isHubIndexable('/haberler')
    });

export default function HaberlerServerPage() {
    return <HaberlerClient breadcrumbs={<PageBreadcrumbs url={'/haberler'}/>} initialPosts={newsData.posts} />;
}
