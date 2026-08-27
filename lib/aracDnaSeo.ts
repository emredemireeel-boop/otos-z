import type { Metadata } from "next";
import { engineDNAData } from "@/data/engine-dna";
import { createSlug, isVehicleEditoriallyReviewed, vehicleDNAData } from "@/data/vehicle-dna";
import { createPageMetadata } from "@/lib/seo";

export type VehicleSection = "kronik-sorunlar" | "neden-alinir" | "kullanici-deneyimleri" | "arac-paketleri";

const sectionMetadata: Record<VehicleSection, {
    title: (name: string) => string;
    description: (name: string) => string;
}> = {
    "kronik-sorunlar": {
        title: name => `${name} Kronik Sorunları`,
        description: name => `${name} kronik arızaları, kullanıcıların bildirdiği yaygın sorunlar, önem seviyeleri ve çözüm önerileri.`,
    },
    "neden-alinir": {
        title: name => `${name} Neden Alınır? Artıları ve Eksileri`,
        description: name => `${name} alınır mı? Modelin güçlü ve zayıf yönlerini, kullanım avantajlarını ve satın almadan önce bilinmesi gerekenleri inceleyin.`,
    },
    "kullanici-deneyimleri": {
        title: name => `${name} Kullanıcı Yorumları ve Deneyimleri`,
        description: name => `${name} sahiplerinin gerçek kullanım deneyimleri, puanları, beğendikleri yönler ve sık dile getirdikleri sorunlar.`,
    },
    "arac-paketleri": {
        title: name => `${name} Donanım Paketleri`,
        description: name => `${name} donanım paketlerini, standart özellikleri ve paketler arasındaki önemli farkları karşılaştırın.`,
    },
};

export function findVehicleByRoute(brand: string, model: string) {
    return vehicleDNAData.find(item => (
        createSlug(item.brand) === brand.toLowerCase()
        && createSlug(item.model) === model.toLowerCase()
    ));
}

function notFoundMetadata(title: string): Metadata {
    return {
        title,
        robots: { index: false, follow: false },
    };
}

export function createVehicleSectionMetadata(
    brand: string,
    model: string,
    section: VehicleSection,
): Metadata {
    const vehicle = findVehicleByRoute(brand, model);
    if (!vehicle) return notFoundMetadata("Araç DNA Verisi Bulunamadı | OtoSöz");

    const name = `${vehicle.brand} ${vehicle.model}`;
    const config = sectionMetadata[section];
    const canonicalPath = `/arac-dna/${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}/${section}`;

    const metadata = createPageMetadata({
        title: config.title(name),
        description: section === 'kullanici-deneyimleri' && vehicle.userExperiences.length === 0
            ? `${name} için henüz onaylanmış sürücü deneyimi bulunmuyor. Mevcut teknik kayıtları inceleyin veya forumda deneyiminizi paylaşın.`
            : config.description(name),
        path: canonicalPath,
        keywords: [config.title(name), `${name} yorumları`, `${name} inceleme`],
    });

    const hasDistinctContent = section === "kronik-sorunlar"
        ? vehicle.chronicIssues.length > 0
        : section === "neden-alinir"
            ? vehicle.strengths.length > 0 || vehicle.weaknesses.length > 0
            : section === "kullanici-deneyimleri"
                ? vehicle.userExperiences.length > 0
                : true;

    return hasDistinctContent && isVehicleEditoriallyReviewed(vehicle)
        ? metadata
        : { ...metadata, robots: { index: false, follow: true } };
}

const engineSuffixes = {
    artilar: "-begenilen-yonleri-ve-en-cok-sikayet-edilen-yonleri",
    kronik: "-kronik-sorunlari",
    donanim: "-arac-paketleri",
    deneyimler: "-kullanici-deneyimleri",
} as const;

type EngineTab = "genel-bakis" | keyof typeof engineSuffixes;

export function createEngineMetadata(brand: string, model: string, engineParam: string): Metadata {
    const vehicle = findVehicleByRoute(brand, model);
    if (!vehicle) return notFoundMetadata("Araç DNA Verisi Bulunamadı | OtoSöz");

    const normalizedEngineParam = engineParam.toLowerCase();
    let baseEngineSlug = normalizedEngineParam;
    let currentTab: EngineTab = "genel-bakis";
    let canonicalSuffix = "";

    for (const [tab, suffix] of Object.entries(engineSuffixes) as [keyof typeof engineSuffixes, string][]) {
        if (normalizedEngineParam.endsWith(suffix)) {
            baseEngineSlug = normalizedEngineParam.slice(0, -suffix.length);
            currentTab = tab;
            canonicalSuffix = suffix;
            break;
        }
    }

    const engine = engineDNAData
        .find(item => item.vehicleId === vehicle.id)
        ?.engines.find(item => item.slug === baseEngineSlug);

    if (!engine) return notFoundMetadata("Motor Seçeneği Bulunamadı | OtoSöz");

    const vehicleName = `${vehicle.brand} ${vehicle.model}`;
    const engineName = `${vehicleName} ${engine.name}`;
    const tabCopy: Record<EngineTab, { title: string; description: string }> = {
        "genel-bakis": {
            title: `${engineName} Motor İncelemesi`,
            description: `${engineName} için DNA puanı, yakıt ve şanzıman bilgileri, performans değerlendirmesi ve bilinen sorunlar.`,
        },
        artilar: {
            title: `${engineName} Artıları ve Eksileri`,
            description: `${engineName} motor ve şanzıman seçeneğinin beğenilen yönleri, zayıf noktaları ve kullanıcı şikâyetleri.`,
        },
        kronik: {
            title: `${engineName} Kronik Sorunları`,
            description: `${engineName} seçeneğinde görülen kronik arızalar, önem seviyeleri, kullanıcı bildirimleri ve çözüm bilgileri.`,
        },
        donanim: {
            title: `${engineName} Donanım Paketleri`,
            description: `${engineName} seçeneğiyle sunulan donanım paketleri ve paketler arasındaki özellik farkları.`,
        },
        deneyimler: {
            title: `${engineName} Kullanıcı Deneyimleri`,
            description: `${engineName} kullanan sürücülerin yorumları, puanları ve gerçek kullanım deneyimleri.`,
        },
    };

    const modelPath = `/arac-dna/${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}`;
    const hasDistinctContent = currentTab === "genel-bakis"
        || (currentTab === "kronik" && engine.chronicIssues.length > 0)
        || (currentTab === "artilar" && Boolean(engine.pros?.length || engine.cons?.length));

    const canonicalPath = currentTab === "donanim"
        ? `${modelPath}/arac-paketleri`
        : currentTab === "deneyimler"
            ? vehicle.userExperiences.length > 0
                ? `${modelPath}/kullanici-deneyimleri`
                : modelPath
            : currentTab === "artilar" && !hasDistinctContent
                ? `${modelPath}/neden-alinir`
                : currentTab === "kronik" && !hasDistinctContent
                    ? `${modelPath}/kronik-sorunlar`
                    : `${modelPath}/${engine.slug}${canonicalSuffix}`;

    const metadata = createPageMetadata({
        title: tabCopy[currentTab].title,
        description: tabCopy[currentTab].description,
        path: canonicalPath,
        keywords: [`${engineName} kronik sorunlar`, `${engineName} yorumları`, `${engineName} inceleme`],
    });

    return hasDistinctContent && isVehicleEditoriallyReviewed(vehicle)
        ? metadata
        : { ...metadata, robots: { index: false, follow: true } };
}
