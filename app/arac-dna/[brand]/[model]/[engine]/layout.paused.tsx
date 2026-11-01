import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { engineDNAData } from "@/data/engine-dna";
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

    // Kalıcı URL ve boş sekme yönlendirmeleri proxy.ts içinde uygulanır.
    return children;
}
