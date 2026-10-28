"use client";

import { isEngineRouteIndexable } from '@/lib/engine-quality';
import { isVehicleSectionIndexable } from '@/lib/indexability';

import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Car, CheckCircle2, Gauge, ShieldCheck, Wrench, Zap } from "lucide-react";
import { vehicleDNAData, createSlug } from "@/data/vehicle-dna";
import { engineDNAData } from "@/data/engine-dna";
import { getVehicleGenerationInfo } from "@/lib/vehicleGeneration";
import { getTopSellingVehicleGuide } from "@/data/top-selling-vehicle-guides";
import TopSellingVehicleGuide from "@/components/TopSellingVehicleGuide";

export default function VehicleModelSelectionPage() {
    const params = useParams();
    const brandSlug = (params?.brand as string)?.toLowerCase() || "";
    const modelSlug = (params?.model as string)?.toLowerCase() || "";
    const vehicle = vehicleDNAData.find((item) => createSlug(item.brand) === brandSlug && createSlug(item.model) === modelSlug);

    if (!vehicle) return null;

    const engineData = engineDNAData.find((item) => item.vehicleId === vehicle.id);
    const generation = getVehicleGenerationInfo(vehicle);
    const guide = getTopSellingVehicleGuide(brandSlug, modelSlug);
    const modelPath = `/arac-dna/${brandSlug}/${modelSlug}`;

    const promotedEngines = (engineData?.engines || []).filter(engine => isEngineRouteIndexable(vehicle, engine));

    return (
        <div className="dna-model-overview">
            <section className="dna-decision-intro">
                <div>
                    <span className="dna-section-kicker"><Gauge size={15} /> Araç karar dosyası</span>
                    <h2>{vehicle.brand} {vehicle.model}: hangi motor kime uygun?</h2>
                    <p>
                        Önce üretim yılı ve jenerasyonu doğrulayın, ardından kullanımınıza uygun motoru seçin.
                        Aşağıdaki özet; güçlü yönleri, dikkat noktalarını ve motor bazlı riskleri ilk ekranda görünür tutar.
                    </p>
                </div>
                <div className="dna-generation-card">
                    <strong>{generation.label}</strong>
                    <span>{vehicle.year} üretim dönemi</span>
                    <small>{engineData?.engines.length || 0} motor/aktarma seçeneği</small>
                </div>
            </section>

            <div className="dna-overview-columns">
                <article>
                    <h3><CheckCircle2 size={19} /> Güçlü yönler</h3>
                    <ul>{vehicle.strengths.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>
                    <Link href={`${modelPath}/neden-alinir`}>Tüm güçlü yönler ve dikkat noktaları <ArrowRight size={15} /></Link>
                </article>
                <article>
                    <h3><AlertTriangle size={19} /> Satın alma kontrolü</h3>
                    <ul>{vehicle.weaknesses.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>
                    {isVehicleSectionIndexable(vehicle, 'kronik-sorunlar') && <Link href={`${modelPath}/kronik-sorunlar`}>Kronik risk dosyasını incele <ArrowRight size={15} /></Link>}
                </article>
            </div>

            {guide && <TopSellingVehicleGuide guide={guide} />}

            <section className="dna-engine-picker" aria-labelledby="dna-engine-title">
                <div className="dna-engine-picker__heading">
                    <div>
                        <span className="dna-section-kicker"><Wrench size={15} /> Motor ve şanzıman</span>
                        <h2 id="dna-engine-title">Aracınızdaki seçeneği belirleyin</h2>
                        <p>Riskler ve kullanıcı deneyimi motor–şanzıman kombinasyonuna göre değişir.</p>
                    </div>
                    <ShieldCheck size={34} />
                </div>

                {promotedEngines.length > 0 ? (
                    <div className="dna-engine-grid">
                        {promotedEngines.map((engine) => (
                            <Link key={engine.slug} href={`${modelPath}/${engine.slug}`}>
                                <span className="dna-engine-icon"><Zap size={21} /></span>
                                <span className="dna-engine-copy">
                                    <strong>{engine.name}</strong>
                                    <small>{engine.fuelType} · {engine.transmission}</small>
                                    {engine.description && <p>{engine.description}</p>}
                                </span>
                                <ArrowRight size={18} />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="dna-empty-note"><Car size={20} /> Bu model için öne çıkarılan motor incelemesi bulunmuyor.</div>
                )}
            </section>

            {engineData?.engines.length ? <details className="dna-empty-note">
                <summary>Tüm motor seçenekleri</summary>
                <ul>{engineData.engines.map(engine => <li key={engine.slug}><Link href={`${modelPath}/${engine.slug}`}>{engine.name}</Link></li>)}</ul>
            </details> : null}

            <p className="dna-disclaimer">
                Araç DNA puanı satın alma garantisi değildir. Araç yaşı, bakım geçmişi, kullanım biçimi ve bağımsız ekspertiz sonucu birlikte değerlendirilmelidir.
            </p>
        </div>
    );
}
