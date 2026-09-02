import Link from "next/link";
import {
    AlertTriangle,
    ArrowRight,
    BookOpen,
    Calculator,
    CalendarDays,
    ChevronRight,
    ClipboardCheck,
    Dna,
    Gauge,
    ShieldCheck,
    Wrench,
} from "lucide-react";
import { events } from "@/data/events";
import { mythsData } from "@/data/efsane-avcilari-data";
import { createSlug as createVehicleSlug, vehicleDNAData } from "@/data/vehicle-dna";

interface ForumThreadSidebarCardsProps {
    side: "left" | "right";
    seedKey: string;
}

const DRIVER_ESSENTIALS = [
    { href: "/obd", title: "OBD arıza kodları", description: "Kodun nedenini ve çözümünü bul", icon: Wrench },
    { href: "/kutuphane?kategori=gosterge-isiklari", title: "Gösterge ışıkları", description: "Uyarının önemini hemen öğren", icon: AlertTriangle },
    { href: "/kutuphane?kategori=ikinci-el-rehberi", title: "İkinci el kontrolü", description: "Satın almadan önce kontrol et", icon: ClipboardCheck },
    { href: "/kutuphane?kategori=kaza-ilkyardim", title: "Kaza ve ilk yardım", description: "Doğru adımları sırayla gör", icon: ShieldCheck },
];

const QUICK_CALCULATORS = [
    { href: "/otohesap/yakit-hesaplama", title: "Yakıt maliyeti", description: "Yolculuk ve aylık gideri hesapla", icon: Calculator },
    { href: "/otohesap/yillik-sahip-olma-maliyeti", title: "Sahip olma maliyeti", description: "Aracın gerçek yıllık giderini gör", icon: Gauge },
    { href: "/otohesap/lastik-basinci-donusturme", title: "Lastik basıncı", description: "PSI, bar ve kPa değerlerini çevir", icon: Gauge },
];

const FEATURED_DNA_MODELS = vehicleDNAData.filter((vehicle) => [1, 2, 3, 4, 5, 6, 7, 8, 13].includes(vehicle.id));

function getStableIndex(value: string, length: number) {
    if (length === 0) return 0;
    const hash = Array.from(value).reduce((total, character) => ((total * 31) + character.charCodeAt(0)) >>> 0, 7);
    return hash % length;
}

export default function ForumThreadSidebarCards({ side, seedKey }: ForumThreadSidebarCardsProps) {
    const myth = mythsData[getStableIndex(seedKey, mythsData.length)];
    const featuredEvent = events[getStableIndex(`${seedKey}-event`, events.length)];
    const dnaStart = getStableIndex(`${seedKey}-dna`, FEATURED_DNA_MODELS.length);
    const featuredDna = Array.from({ length: Math.min(4, FEATURED_DNA_MODELS.length) }, (_, index) => (
        FEATURED_DNA_MODELS[(dnaStart + index) % FEATURED_DNA_MODELS.length]
    ));

    if (side === "left") {
        return (
            <>
                <section className="forum-sidebar-card forum-resource-card" aria-labelledby="thread-driver-tools-title">
                    <div className="forum-sidebar-heading">
                        <div>
                            <span className="forum-sidebar-kicker">Sürücü araçları</span>
                            <h2 id="thread-driver-tools-title"><Wrench size={15} /> Yolda lazım olur</h2>
                        </div>
                        <Link href="/kutuphane" className="forum-heading-link">Tümü <ChevronRight size={13} /></Link>
                    </div>
                    <div className="forum-resource-list">
                        {DRIVER_ESSENTIALS.map(({ href, title, description, icon: ToolIcon }) => (
                            <Link key={href} href={href} className="forum-resource-row">
                                <span className="forum-resource-icon"><ToolIcon size={15} /></span>
                                <span className="forum-resource-copy">
                                    <strong>{title}</strong>
                                    <small>{description}</small>
                                </span>
                                <ChevronRight size={14} />
                            </Link>
                        ))}
                    </div>
                </section>

                {myth && (
                    <section className="forum-sidebar-card forum-myth-card">
                        <span className="forum-sidebar-kicker">Kütüphaneden ilginç bilgi</span>
                        <h3>Doğru mu, efsane mi?</h3>
                        <Link href={`/kutuphane/efsane-avcilari/${myth.slug}--${myth.id}`}>
                            <p>“{myth.myth}”</p>
                            <span className="forum-card-link">Gerçeğini öğren <ArrowRight size={14} /></span>
                        </Link>
                    </section>
                )}
            </>
        );
    }

    return (
        <>
            <section className="forum-sidebar-card forum-guide-card">
                <span className="forum-sidebar-kicker">Kütüphane seçkisi</span>
                <div className="forum-guide-icon"><BookOpen size={18} /></div>
                <h2>Aracını doğru tanı, masrafı önceden gör</h2>
                <p>Bakım, arıza, gösterge ışıkları ve ikinci el kontrol rehberlerini tek yerde incele.</p>
                <Link href="/kutuphane" className="forum-card-link">
                    Kütüphaneyi keşfet <ArrowRight size={14} />
                </Link>
            </section>

            <section className="forum-sidebar-card forum-resource-card" aria-labelledby="thread-calculators-title">
                <div className="forum-sidebar-heading">
                    <div>
                        <span className="forum-sidebar-kicker">OtoHesap</span>
                        <h2 id="thread-calculators-title"><Calculator size={15} /> Hızlı hesaplamalar</h2>
                    </div>
                    <Link href="/otohesap" className="forum-heading-link">Tümü <ChevronRight size={13} /></Link>
                </div>
                <div className="forum-resource-list">
                    {QUICK_CALCULATORS.map(({ href, title, description, icon: ToolIcon }) => (
                        <Link key={href} href={href} className="forum-resource-row">
                            <span className="forum-resource-icon"><ToolIcon size={15} /></span>
                            <span className="forum-resource-copy">
                                <strong>{title}</strong>
                                <small>{description}</small>
                            </span>
                            <ChevronRight size={14} />
                        </Link>
                    ))}
                </div>
            </section>

            {featuredDna.length > 0 && (
                <section className="forum-sidebar-card forum-dna-card" aria-labelledby="thread-dna-title">
                    <div className="forum-sidebar-heading">
                        <div>
                            <span className="forum-sidebar-kicker">Araç DNA&apos;dan</span>
                            <h2 id="thread-dna-title"><Dna size={15} /> Popüler araç dosyaları</h2>
                        </div>
                    </div>
                    <div className="forum-dna-list">
                        {featuredDna.map((vehicle) => (
                            <Link
                                key={vehicle.id}
                                href={`/arac-dna/${createVehicleSlug(vehicle.brand)}/${createVehicleSlug(vehicle.model)}`}
                                className="forum-dna-row"
                            >
                                <span className="forum-dna-copy">
                                    <strong>{vehicle.brand} {vehicle.model}</strong>
                                    <small>{vehicle.chronicIssues.length} kronik konu · {vehicle.totalReports} kullanıcı raporu</small>
                                </span>
                                <span className="forum-dna-score" title={`DNA puanı ${vehicle.dnaScore}`}>{vehicle.dnaScore}</span>
                            </Link>
                        ))}
                    </div>
                    <Link href="/arac-dna" className="forum-card-link forum-card-footer-link">
                        Tüm araçları keşfet <ArrowRight size={14} />
                    </Link>
                </section>
            )}

            {featuredEvent && (
                <section className="forum-sidebar-card forum-event-card">
                    <span className="forum-sidebar-kicker">Yaklaşan etkinlik</span>
                    <div className="forum-event-meta">
                        <span className="forum-event-date">
                            <CalendarDays size={15} />
                            {new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }).format(new Date(featuredEvent.date))}
                        </span>
                        <span>{featuredEvent.city}</span>
                    </div>
                    <h2>{featuredEvent.title}</h2>
                    <Link href={`/etkinlikler/${featuredEvent.id}`} className="forum-card-link">
                        Etkinliği incele <ArrowRight size={14} />
                    </Link>
                </section>
            )}
        </>
    );
}
