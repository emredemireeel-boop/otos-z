import type { VehicleDNA } from "@/data/vehicle-dna";
import type { EngineOption } from "@/data/engine-dna";

export interface VehicleFaqItem {
    question: string;
    answer: string;
}

function concise(items: string[], limit = 3) {
    return items.slice(0, limit).map(item => item.replace(/[.!?]+$/, "")).join(", ");
}

export function buildVehicleFaq(vehicle: VehicleDNA, engines: EngineOption[] = []): VehicleFaqItem[] {
    const name = `${vehicle.brand} ${vehicle.model}`;
    const issues = vehicle.chronicIssues || [];
    const strengths = vehicle.strengths || [];
    const weaknesses = vehicle.weaknesses || [];
    const engineNames = engines.map(engine => `${engine.name} ${engine.fuelType} (${engine.transmission})`);
    const faqs: VehicleFaqItem[] = [];

    if (strengths.length || weaknesses.length) {
        faqs.push({
            question: `${name} alınır mı?`,
            answer: strengths.length && weaknesses.length
                ? `${name}; ${concise(strengths)} yönleriyle öne çıkıyor. Satın almadan önce ${concise(weaknesses, 2)} başlıklarını araç özelinde kontrol etmek gerekir. OtoSöz DNA puanı ${vehicle.dnaScore}/100'dür; nihai karar ekspertiz ve bakım geçmişiyle birlikte verilmelidir.`
                : `${name} için OtoSöz DNA puanı ${vehicle.dnaScore}/100'dür. Satın alma kararı araç geçmişi, ekspertiz ve kullanım ihtiyacıyla birlikte değerlendirilmelidir.`,
        });
    }

    if (issues.length) {
        faqs.push({
            question: `${name} kronik sorunları nelerdir?`,
            answer: `Kullanıcı raporlarında öne çıkan başlıklar: ${issues.slice(0, 4).map(issue => issue.title).join(", ")}${issues.length > 4 ? ". Tüm kayıtlar kronik sorunlar sekmesinde önem seviyesi ve rapor sayısıyla listelenir" : ""}. Bu liste her araçta kesin arıza oluşacağı anlamına gelmez.`,
        });
    }

    if (engineNames.length) {
        faqs.push({
            question: `${name} hangi motor ve şanzıman seçenekleriyle inceleniyor?`,
            answer: `OtoSöz Araç DNA dosyasında ${engineNames.slice(0, 5).join(", ")} seçenekleri ayrı ayrı incelenir. Motor sayfasında puan, kullanıcıların bildirdiği sorunlar ve varsa yakıt tüketimi notları birlikte gösterilir.`,
        });
    }

    faqs.push({
        question: `${name} kullanıcı yorumları güvenilir mi?`,
        answer: `OtoSöz'deki kullanıcı deneyimleri topluluk katkısıdır; rapor sayıları tek başına arıza oranı değildir. Satın alma öncesinde şasi numarası, servis geçmişi, geri çağırma kaydı ve bağımsız ekspertiz kontrol edilmelidir.`,
    });

    return faqs.slice(0, 4);
}
