"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    AlertTriangle,
    ArrowRight,
    BadgeCheck,
    BarChart3,
    BookOpen,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    CircleHelp,
    Clock3,
    FileQuestion,
    Gauge,
    GraduationCap,
    SearchCheck,
    ShieldAlert,
    Sparkles,
    Stethoscope,
    Wrench,
} from "lucide-react";
import {
    getThreadSlugUrl,
    subscribeToThreads,
    type ForumThread,
} from "@/lib/forumService";
import { SAMPLE_EXPERT_QUESTIONS } from "@/data/showcase-content";
import { mythsData } from "@/data/efsane-avcilari-data";

interface ExpertQuestionSidebarsProps {
    side: "left" | "right";
    questionId: string;
    category: string;
}

interface ExpertEntryPaginationProps {
    currentPage: number;
    totalPages: number;
    entryCount: number;
    questionId: string;
}

const BASE_RESOURCES = [
    { href: "/obd", title: "OBD kodunu araştır", description: "Arıza kodunun anlamını ve kontrol sırasını gör", icon: SearchCheck },
    { href: "/kutuphane?kategori=gosterge-isiklari", title: "Gösterge ışıkları", description: "Uyarı lambasının aciliyetini öğren", icon: AlertTriangle },
    { href: "/otohesap/arac-bakim", title: "Bakım maliyetini hesapla", description: "Muhtemel bakım bütçeni önceden planla", icon: BarChart3 },
];

const CATEGORY_RESOURCES: Record<string, typeof BASE_RESOURCES> = {
    motor: [
        { href: "/obd", title: "Motor arıza kodları", description: "P kodlarını belirti ve nedenleriyle incele", icon: Wrench },
        { href: "/kutuphane/efsane-avcilari/sabah-motoru-isitmak--4", title: "Soğuk motor efsanesi", description: "Rölantide ısıtma doğru mu, öğren", icon: BookOpen },
        { href: "/otohesap/arac-bakim", title: "Bakım maliyeti", description: "Yağ, filtre ve işçilik bütçesi oluştur", icon: Gauge },
    ],
    "şanzıman": [
        { href: "/sozluk/sanziman", title: "Şanzıman sözlüğü", description: "Kavrama, mekatronik ve tork konvertörünü tanı", icon: BookOpen },
        { href: "/obd", title: "Şanzıman arıza kodları", description: "Kayıtlı arıza kodunu açıklamasıyla bul", icon: SearchCheck },
        { href: "/otohesap/arac-bakim", title: "Bakım bütçesi", description: "Periyodik giderleri karşılaştır", icon: BarChart3 },
    ],
    sanzıman: [
        { href: "/sozluk/sanziman", title: "Şanzıman sözlüğü", description: "Kavrama, mekatronik ve tork konvertörünü tanı", icon: BookOpen },
        { href: "/obd", title: "Şanzıman arıza kodları", description: "Kayıtlı arıza kodunu açıklamasıyla bul", icon: SearchCheck },
        { href: "/otohesap/arac-bakim", title: "Bakım bütçesi", description: "Periyodik giderleri karşılaştır", icon: BarChart3 },
    ],
    lastik: [
        { href: "/otohesap/lastik-ebat", title: "Lastik ebat hesabı", description: "Çap ve hız göstergesi sapmasını karşılaştır", icon: Gauge },
        { href: "/otohesap/lastik-basinci-donusturme", title: "PSI / bar çevirici", description: "Kapı etiketi ve pompa değerini eşleştir", icon: BarChart3 },
        { href: "/kutuphane", title: "Lastik ve jant rehberleri", description: "Güvenli seçim için temel kontroller", icon: BookOpen },
    ],
};

function normalizeCategory(category: string) {
    return category.trim().toLocaleLowerCase("tr-TR");
}

function getRelativeTime(thread: ForumThread) {
    const createdAt = thread.createdAt?.toMillis?.();
    if (!createdAt) return "";
    const minutes = Math.max(0, Math.floor((Date.now() - createdAt) / 60_000));
    if (minutes < 1) return "az önce";
    if (minutes < 60) return `${minutes} dk`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} sa`;
    return `${Math.floor(hours / 24)} gün`;
}

function LatestTenThreads() {
    const [threads, setThreads] = useState<ForumThread[]>([]);

    useEffect(() => {
        const unsubscribe = subscribeToThreads((allThreads) => {
            const latest = [...allThreads]
                .sort((first, second) => (second.createdAt?.toMillis?.() || 0) - (first.createdAt?.toMillis?.() || 0))
                .slice(0, 10);
            setThreads(latest);
        }, 20);
        return () => unsubscribe();
    }, []);

    return (
        <section className="expert-side-card expert-latest-card" aria-labelledby="expert-latest-title">
            <div className="expert-side-heading">
                <div>
                    <span className="expert-side-kicker">Topluluk gündemi</span>
                    <h2 id="expert-latest-title"><Clock3 size={15} /> Son 10 başlık</h2>
                </div>
                <Link href="/forum">Tümü <ChevronRight size={12} /></Link>
            </div>

            {threads.length === 0 ? (
                <div className="expert-side-empty">Başlıklar yükleniyor…</div>
            ) : (
                <ol className="expert-latest-list">
                    {threads.map((thread, index) => (
                        <li key={thread.id}>
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <Link href={getThreadSlugUrl(thread)}>
                                <strong>{thread.title}</strong>
                                <small>
                                    {thread.entryCount || 0} entry
                                    <i>·</i>
                                    {getRelativeTime(thread)}
                                </small>
                            </Link>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
}

export function ExpertQuestionSidebars({ side, questionId, category }: ExpertQuestionSidebarsProps) {
    const normalizedCategory = normalizeCategory(category);
    const resources = CATEGORY_RESOURCES[normalizedCategory] ?? BASE_RESOURCES;
    const relatedQuestions = SAMPLE_EXPERT_QUESTIONS.filter((question) => question.id !== questionId).slice(0, 3);
    const myth = mythsData[Math.abs(Array.from(questionId).reduce((total, char) => total + char.charCodeAt(0), 0)) % mythsData.length];

    if (side === "left") {
        return (
            <>
                <section className="expert-side-card expert-question-cta">
                    <span className="expert-side-icon"><CircleHelp size={19} /></span>
                    <span className="expert-side-kicker">Senin aracın, senin sorun</span>
                    <h2>Belirtiyi yaz, doğru görüşe daha hızlı ulaş.</h2>
                    <p>Model, motor, kilometre ve arıza anını ekleyerek yeni bir uzman sorusu oluştur.</p>
                    <Link href="/uzmana-sor" className="expert-side-primary-link">
                        Kendi sorunu sor <ArrowRight size={14} />
                    </Link>
                </section>

                <section className="expert-side-card expert-application-card">
                    <div className="expert-side-heading compact">
                        <div>
                            <span className="expert-side-kicker">Bilgin değerli</span>
                            <h2><GraduationCap size={15} /> Uzman ekibine katıl</h2>
                        </div>
                    </div>
                    <p>Usta, servis danışmanı, ekspertiz uzmanı veya trafik profesyoneliysen deneyimini doğrulanmış profilinle paylaş.</p>
                    <ul>
                        <li><BadgeCheck size={14} /> Uzman rozeti</li>
                        <li><CheckCircle2 size={14} /> Yetkinlik incelemesi</li>
                        <li><Sparkles size={14} /> Görünür katkı profili</li>
                    </ul>
                    <Link href="/uzman-ol" className="expert-side-text-link">
                        Uzmanlık başvurusu yap <ArrowRight size={13} />
                    </Link>
                </section>

                <section className="expert-side-card expert-resource-card" aria-labelledby="expert-resources-title">
                    <div className="expert-side-heading">
                        <div>
                            <span className="expert-side-kicker">Bu soruya uygun</span>
                            <h2 id="expert-resources-title"><BookOpen size={15} /> Teknik kaynaklar</h2>
                        </div>
                    </div>
                    <div className="expert-resource-list">
                        {resources.map(({ href, title, description, icon: Icon }) => (
                            <Link href={href} key={href}>
                                <span><Icon size={15} /></span>
                                <div>
                                    <strong>{title}</strong>
                                    <small>{description}</small>
                                </div>
                                <ChevronRight size={13} />
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="expert-side-card expert-checklist-card">
                    <span className="expert-side-kicker">Daha iyi yanıt için</span>
                    <h2><FileQuestion size={15} /> Soruna bunları ekle</h2>
                    <ul>
                        <li><span>01</span> Marka, model, motor ve model yılı</li>
                        <li><span>02</span> Kilometre ve son bakım tarihi</li>
                        <li><span>03</span> Belirtinin ne zaman başladığı</li>
                        <li><span>04</span> Varsa arıza kodu ve yapılan test</li>
                    </ul>
                </section>
            </>
        );
    }

    return (
        <>
            <LatestTenThreads />

            {relatedQuestions.length > 0 && (
                <section className="expert-side-card expert-related-card" aria-labelledby="related-expert-questions-title">
                    <div className="expert-side-heading">
                        <div>
                            <span className="expert-side-kicker">Benzer değerlendirmeler</span>
                            <h2 id="related-expert-questions-title"><Stethoscope size={15} /> İlgili uzman soruları</h2>
                        </div>
                    </div>
                    <div className="expert-related-list">
                        {relatedQuestions.map((question) => (
                            <Link href={`/uzmana-sor/${question.id}`} key={question.id}>
                                <span>{question.category}</span>
                                <strong>{question.title}</strong>
                                <small>{Math.max(0, question.entries.length - 1)} örnek yanıt</small>
                            </Link>
                        ))}
                    </div>
                    <Link href="/uzmana-sor" className="expert-side-text-link expert-side-footer-link">
                        Tüm soruları incele <ArrowRight size={13} />
                    </Link>
                </section>
            )}

            {myth && (
                <section className="expert-side-card expert-myth-card">
                    <span className="expert-side-kicker">Kütüphaneden</span>
                    <h2>Doğru mu, efsane mi?</h2>
                    <p>“{myth.myth}”</p>
                    <Link href={`/kutuphane/efsane-avcilari/${myth.slug}--${myth.id}`} className="expert-side-text-link">
                        Gerçeğini öğren <ArrowRight size={13} />
                    </Link>
                </section>
            )}

            <section className="expert-side-card expert-safety-card">
                <span className="expert-side-icon"><ShieldAlert size={19} /></span>
                <span className="expert-side-kicker">Güvenlik notu</span>
                <h2>Uzaktan görüş, fiziksel teşhis değildir.</h2>
                <p>Hararet, fren kaybı, yoğun duman, yakıt kokusu veya kırmızı uyarı varsa aracı zorlamayın; güvenli yerde durup profesyonel destek alın.</p>
            </section>
        </>
    );
}

function pageHref(questionId: string, page: number) {
    return page <= 1
        ? `/uzmana-sor/${questionId}#entryler`
        : `/uzmana-sor/${questionId}?sayfa=${page}#entryler`;
}

export function ExpertEntryPagination({ currentPage, totalPages, entryCount, questionId }: ExpertEntryPaginationProps) {
    const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1)
        .filter((page) => totalPages <= 7 || page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1);

    return (
        <nav className="expert-entry-pagination" aria-label="Entry sayfaları">
            <div>
                <strong>{entryCount}</strong>
                <span>entry · sayfa başına 10</span>
            </div>
            <div className="expert-pagination-pages">
                {currentPage > 1 ? (
                    <Link href={pageHref(questionId, currentPage - 1)} scroll={false} aria-label="Önceki sayfa">
                        <ChevronLeft size={15} />
                    </Link>
                ) : (
                    <span className="is-disabled"><ChevronLeft size={15} /></span>
                )}

                {visiblePages.map((page, index) => {
                    const previousPage = visiblePages[index - 1];
                    return (
                        <span className="expert-page-number-wrap" key={page}>
                            {previousPage && page - previousPage > 1 ? <i>…</i> : null}
                            <Link
                                href={pageHref(questionId, page)}
                                scroll={false}
                                className={page === currentPage ? "is-active" : ""}
                                aria-current={page === currentPage ? "page" : undefined}
                            >
                                {page}
                            </Link>
                        </span>
                    );
                })}

                {currentPage < totalPages ? (
                    <Link href={pageHref(questionId, currentPage + 1)} scroll={false} aria-label="Sonraki sayfa">
                        <ChevronRight size={15} />
                    </Link>
                ) : (
                    <span className="is-disabled"><ChevronRight size={15} /></span>
                )}
            </div>
            <span className="expert-pagination-status">{currentPage}/{totalPages}</span>
        </nav>
    );
}
