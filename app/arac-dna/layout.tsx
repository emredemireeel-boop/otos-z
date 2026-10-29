import {itemList as buildSchemaItemList} from '@/lib/schema';
import {schemaJson} from '@/lib/schema';
import { createPageMetadata } from '@/lib/seo';
import { topSellingVehicleGuides, topSellingPeriod } from '@/data/top-selling-vehicle-guides';

export const metadata = createPageMetadata({
        title: 'Araç DNA Analizi: Jenerasyon, Motor ve Kronik Sorunlar',
        description: 'Aracın yılından jenerasyonunu bulun; motor ve şanzıman seçeneklerini, kronik riskleri, güçlü yönleri ve kullanıcı deneyimlerini karşılaştırın.',
        path: '/arac-dna'
    });

export default function AracDnaRootLayout({children}:{children:React.ReactNode}){return <>{children}</>;}
