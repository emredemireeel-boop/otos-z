import { permanentRedirect } from "next/navigation";

interface PageProps {
    params: Promise<{ slug: string; code: string }>;
}

/**
 * /obd/{brand}/{code} → /obd/{code} 308 permanent redirect
 * 
 * Bu sayfa artık doğrudan içerik sunmuyor.
 * Tüm OBD kod detayları canonical URL olan /obd/{code} üzerinden sunulur.
 * Bu redirect, Google'ın crawl budget'ını korur ve duplicate content sorununu
 * tamamen ortadan kaldırır.
 */
export default async function BrandOBDCodePage({ params }: PageProps) {
    const { code } = await params;
    permanentRedirect(`/obd/${code.toLowerCase()}`);
}

