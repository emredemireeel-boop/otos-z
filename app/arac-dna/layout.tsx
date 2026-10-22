import { createPageMetadata } from '@/lib/seo';
import { topSellingVehicleGuides, topSellingPeriod } from '@/data/top-selling-vehicle-guides';

export const metadata = createPageMetadata({
    title: 'Araç DNA Analizi: Jenerasyon, Motor ve Kronik Sorunlar',
    description: 'Aracın yılından jenerasyonunu bulun; motor ve şanzıman seçeneklerini, kronik riskleri, güçlü yönleri ve kullanıcı deneyimlerini karşılaştırın.',
    path: '/arac-dna',
    keywords: [
        'araç kronik sorunları', 'hangi motor alınır', 'araba jenerasyon bulma',
        'araç kullanıcı yorumları', 'Clio 4 ve Clio 5 farkları', 'otomobil satın alma rehberi',
    ],
});

export default function AracDnaRootLayout({ children }: { children: React.ReactNode }) {
    const itemList = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${topSellingPeriod} Türkiye'de en çok satan otomobiller`,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        numberOfItems: topSellingVehicleGuides.length,
        itemListElement: topSellingVehicleGuides.map((guide) => ({
            '@type': 'ListItem',
            position: guide.rank,
            url: `https://otosoz.com/arac-dna/${guide.vehiclePath}`,
            name: guide.generation,
        })),
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
            {children}
        </>
    );
}
