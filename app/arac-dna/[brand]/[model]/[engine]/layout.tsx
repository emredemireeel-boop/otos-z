import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { engineDNAData } from "@/data/engine-dna";
import { trimLevelsData } from "@/data/trim-levels";
import { createSlug } from "@/data/vehicle-dna";
import { createEngineMetadata, findVehicleByRoute } from "@/lib/aracDnaSeo";

const ENGINE_SUFFIXES = [
    "-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri",
    "-kronik-sorunlari",
    "-arac-paketleri",
    "-kullanici-deneyimleri",
] as const;

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ brand: string; model: string; engine: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { brand, model, engine } = await params;
    return createEngineMetadata(brand, model, engine);
}

export default async function EngineLayout({ children, params }: LayoutProps) {
    const { brand, model, engine } = await params;
    const vehicle = findVehicleByRoute(brand, model);
    if (!vehicle) notFound();

    const normalizedEngine = engine.toLowerCase();
    const suffix = ENGINE_SUFFIXES.find(value => normalizedEngine.endsWith(value)) || "";
    const baseEngineSlug = suffix
        ? normalizedEngine.slice(0, -suffix.length)
        : normalizedEngine;
    const engineData = engineDNAData
        .find(item => item.vehicleId === vehicle.id)
        ?.engines.find(item => item.slug === baseEngineSlug);

    if (!engineData) notFound();

    const canonicalPath = `/arac-dna/${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}/${baseEngineSlug}${suffix}`;
    if (`/arac-dna/${brand}/${model}/${engine}` !== canonicalPath) permanentRedirect(canonicalPath);

    const modelPath = `/arac-dna/${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}`;
    if (suffix === "-arac-paketleri") {
        const hasTrimLevels = trimLevelsData.some(item => item.vehicleId === vehicle.id);
        permanentRedirect(hasTrimLevels ? `${modelPath}/arac-paketleri` : modelPath);
    }
    if (suffix === "-kullanici-deneyimleri") {
        permanentRedirect(vehicle.userExperiences.length > 0 ? `${modelPath}/kullanici-deneyimleri` : modelPath);
    }
    if (suffix === "-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri"
        && !engineData.pros?.length && !engineData.cons?.length) {
        permanentRedirect(
            vehicle.strengths.length > 0 || vehicle.weaknesses.length > 0
                ? `${modelPath}/neden-alinir`
                : modelPath,
        );
    }
    if (suffix === "-kronik-sorunlari" && engineData.chronicIssues.length === 0) {
        permanentRedirect(vehicle.chronicIssues.length > 0 ? `${modelPath}/kronik-sorunlar` : modelPath);
    }

    return children;
}
