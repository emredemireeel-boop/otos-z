import {createPageMetadata} from '@/lib/seo';
import { Metadata } from "next";
import OzelPlakalarClient from "./OzelPlakalarClient";

export const metadata: Metadata = createPageMetadata({
        path:"/kutuphane/ozel-plakalar",
        title: 'Özel Plakalar Nelerdir? Kimlere Verilir? | OtoSöz Kütüphane',
        description: 'Kırmızı plaka, yeşil plaka, mavi plaka ve diğer resmi/özel plakaların anlamları. Makam, diplomatik ve polis araç plakaları hakkında detaylı rehber.'
    });

export default function OzelPlakalarPage() {
    return <OzelPlakalarClient />;
}
