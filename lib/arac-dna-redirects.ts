import { createSlug, vehicleDNAData } from '../data/vehicle-dna';
import { engineDNAData } from '../data/engine-dna';

// İçerik çekmeden, bellekteki katalogdan eski boş motor sekmelerini çöz.
// Aynı model slug'ı birden çok kayıtta varsa sayfalardaki .find() sırasını koru.
const redirects = new Map<string, string>();
const seenModels = new Set<string>();
const enginesByVehicle = new Map(engineDNAData.map(item => [item.vehicleId, item.engines]));

for (const vehicle of vehicleDNAData) {
    const modelPath = `/arac-dna/${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}`;
    if (seenModels.has(modelPath)) continue;
    seenModels.add(modelPath);

    for (const engine of enginesByVehicle.get(vehicle.id) || []) {
        const enginePath = `${modelPath}/${engine.slug}`;
        if (!engine.pros?.length && !engine.cons?.length) {
            redirects.set(`${enginePath}-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri`,
                vehicle.strengths.length || vehicle.weaknesses.length
                    ? `${modelPath}/neden-alinir` : modelPath);
        }
        if (engine.chronicIssues.length === 0) {
            redirects.set(`${enginePath}-kronik-sorunlari`,
                vehicle.chronicIssues.length ? `${modelPath}/kronik-sorunlar` : modelPath);
        }
    }
}

export function getDnaLegacyRedirect(path: string): string | undefined {
    return redirects.get(path);
}
