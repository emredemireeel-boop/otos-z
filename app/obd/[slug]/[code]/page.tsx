import { notFound } from "next/navigation";

/**
 * /obd/{brand}/{code} → /obd/{code} 308 permanent redirect
 * 
 * Bu sayfa artık doğrudan içerik sunmuyor. Geçerli eski yollar next.config.ts
 * tarafından render öncesinde taşınır; eşleşmeyen geçersiz kodlar 404 alır.
 * Tüm OBD kod detayları canonical URL olan /obd/{code} üzerinden sunulur.
 * Bu redirect, Google'ın crawl budget'ını korur ve duplicate content sorununu
 * tamamen ortadan kaldırır.
 */
export default function BrandOBDCodePage() {
    notFound();
}

