"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";
import {
    BarChart3,
    Check,
    ChevronRight,
    Cookie,
    LockKeyhole,
    Megaphone,
    Settings2,
    ShieldCheck,
    X,
} from "lucide-react";

const CONSENT_COOKIE = "otosoz_cookie_consent";
const CONSENT_VERSION = 1;
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
const GA_ID = "G-WBNEVXRYML";

export interface CookiePreferences {
    version: number;
    necessary: true;
    analytics: boolean;
    marketing: boolean;
    updatedAt: string;
}

type ConsentDraft = Pick<CookiePreferences, "analytics" | "marketing">;

const EMPTY_DRAFT: ConsentDraft = {
    analytics: false,
    marketing: false,
};

let consentSnapshot: CookiePreferences | null | undefined;
const consentListeners = new Set<() => void>();

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

function isCookiePreferences(value: unknown): value is CookiePreferences {
    if (!value || typeof value !== "object") return false;
    const candidate = value as Partial<CookiePreferences>;
    return candidate.version === CONSENT_VERSION
        && candidate.necessary === true
        && typeof candidate.analytics === "boolean"
        && typeof candidate.marketing === "boolean"
        && typeof candidate.updatedAt === "string";
}

function readConsentCookie(): CookiePreferences | null {
    if (typeof document === "undefined") return null;
    const cookie = document.cookie
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${CONSENT_COOKIE}=`));

    if (!cookie) return null;

    try {
        const parsed = JSON.parse(decodeURIComponent(cookie.slice(CONSENT_COOKIE.length + 1)));
        return isCookiePreferences(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

function getConsentSnapshot(): CookiePreferences | null {
    if (consentSnapshot === undefined) consentSnapshot = readConsentCookie();
    return consentSnapshot;
}

function subscribeToConsent(listener: () => void) {
    consentListeners.add(listener);
    return () => consentListeners.delete(listener);
}

function notifyConsentListeners() {
    consentListeners.forEach((listener) => listener());
}

function deleteAnalyticsCookies() {
    if (typeof document === "undefined") return;

    const cookieNames = document.cookie
        .split(";")
        .map((part) => part.trim().split("=")[0])
        .filter((name) => name === "_ga" || name === "_gid" || name === "_gat" || name.startsWith("_ga_"));

    const hostname = window.location.hostname;
    const rootDomain = hostname.endsWith("otosoz.com") ? ".otosoz.com" : hostname;

    cookieNames.forEach((name) => {
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
        document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${hostname}; SameSite=Lax`;
        document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${rootDomain}; SameSite=Lax`;
    });
}

function updateGoogleConsent(preferences: CookiePreferences) {
    if (typeof window === "undefined") return;

    window.gtag?.("consent", "update", {
        analytics_storage: preferences.analytics ? "granted" : "denied",
        ad_storage: preferences.marketing ? "granted" : "denied",
        ad_user_data: preferences.marketing ? "granted" : "denied",
        ad_personalization: preferences.marketing ? "granted" : "denied",
        functionality_storage: "granted",
        security_storage: "granted",
    });

    if (!preferences.analytics) deleteAnalyticsCookies();
}

function saveConsent(draft: ConsentDraft): CookiePreferences {
    const preferences: CookiePreferences = {
        version: CONSENT_VERSION,
        necessary: true,
        analytics: draft.analytics,
        marketing: draft.marketing,
        updatedAt: new Date().toISOString(),
    };

    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(preferences))}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;

    consentSnapshot = preferences;
    updateGoogleConsent(preferences);
    notifyConsentListeners();
    window.dispatchEvent(new CustomEvent("otosoz:cookie-consent-changed", { detail: preferences }));
    return preferences;
}

interface PreferenceRowProps {
    icon: typeof LockKeyhole;
    title: string;
    description: string;
    meta: string;
    enabled: boolean;
    locked?: boolean;
    onToggle?: () => void;
}

function PreferenceRow({ icon: Icon, title, description, meta, enabled, locked = false, onToggle }: PreferenceRowProps) {
    return (
        <article className="cookie-preference-row">
            <span className="cookie-preference-icon" aria-hidden="true"><Icon size={19} /></span>
            <div className="cookie-preference-copy">
                <div className="cookie-preference-heading">
                    <h3>{title}</h3>
                    <span>{meta}</span>
                </div>
                <p>{description}</p>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={`${title}: ${enabled ? "açık" : "kapalı"}`}
                className={`cookie-toggle ${enabled ? "is-enabled" : ""} ${locked ? "is-locked" : ""}`}
                onClick={onToggle}
                disabled={locked}
            >
                <span>{locked ? <Check size={12} /> : null}</span>
            </button>
        </article>
    );
}

export default function CookieConsent() {
    const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, () => null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [draft, setDraft] = useState<ConsentDraft>(EMPTY_DRAFT);
    const modalTitleRef = useRef<HTMLHeadingElement>(null);
    const modalRef = useRef<HTMLElement>(null);

    const openSettings = () => {
        setDraft({
            analytics: consent?.analytics ?? false,
            marketing: consent?.marketing ?? false,
        });
        setSettingsOpen(true);
    };

    useEffect(() => {
        const openFromElsewhere = () => openSettings();
        window.addEventListener("otosoz:open-cookie-settings", openFromElsewhere);
        return () => window.removeEventListener("otosoz:open-cookie-settings", openFromElsewhere);
    });

    useEffect(() => {
        if (!settingsOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        modalTitleRef.current?.focus();

        const handleModalKeys = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSettingsOpen(false);
                return;
            }
            if (event.key !== "Tab") return;

            const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
                'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
            );
            if (!focusable?.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && (document.activeElement === first || document.activeElement === modalTitleRef.current)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        window.addEventListener("keydown", handleModalKeys);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleModalKeys);
        };
    }, [settingsOpen]);

    const acceptAll = () => {
        saveConsent({ analytics: true, marketing: true });
        setSettingsOpen(false);
    };

    const rejectOptional = () => {
        saveConsent(EMPTY_DRAFT);
        setSettingsOpen(false);
    };

    const saveDraft = () => {
        saveConsent(draft);
        setSettingsOpen(false);
    };

    return (
        <>
            {consent?.analytics && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics-consented" strategy="afterInteractive">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            window.gtag = gtag;
                            gtag('consent', 'update', {
                                analytics_storage: 'granted',
                                ad_storage: '${consent.marketing ? "granted" : "denied"}',
                                ad_user_data: '${consent.marketing ? "granted" : "denied"}',
                                ad_personalization: '${consent.marketing ? "granted" : "denied"}'
                            });
                            gtag('js', new Date());
                            gtag('config', '${GA_ID}', {
                                anonymize_ip: true,
                                allow_google_signals: ${consent.marketing},
                                allow_ad_personalization_signals: ${consent.marketing}
                            });
                        `}
                    </Script>
                </>
            )}

            {!consent && !settingsOpen && (
                <section
                    className="cookie-consent-banner"
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby="cookie-consent-title"
                    aria-describedby="cookie-consent-description"
                >
                    <div className="cookie-consent-brand">
                        <span className="cookie-consent-brand-icon" aria-hidden="true"><ShieldCheck size={23} /></span>
                        <div>
                            <span>OtoSöz gizlilik merkezi</span>
                            <strong>Kontrol sizde</strong>
                        </div>
                    </div>

                    <div className="cookie-consent-message">
                        <span className="cookie-consent-kicker">Açık, anlaşılır ve seçime dayalı</span>
                        <h2 id="cookie-consent-title">Çerez tercihinizi siz belirleyin.</h2>
                        <p id="cookie-consent-description">
                            Zorunlu çerezleri oturum ve güvenlik için kullanıyoruz. Analiz ve kişiselleştirme teknolojileri
                            yalnızca izin verirseniz çalışır; reddetmeniz sitenin temel işlevlerini etkilemez.
                        </p>
                        <div className="cookie-consent-links">
                            <Link href="/cerez-politikasi">Çerez politikası <ChevronRight size={13} /></Link>
                            <Link href="/gizlilik-politikasi">Gizlilik politikası <ChevronRight size={13} /></Link>
                        </div>
                    </div>

                    <div className="cookie-consent-actions" aria-label="Çerez seçimleri">
                        <button type="button" onClick={acceptAll}>Tümünü kabul et</button>
                        <button type="button" onClick={rejectOptional}>Gerekli olmayanları reddet</button>
                        <button type="button" onClick={openSettings}><Settings2 size={15} /> Tercihleri yönet</button>
                    </div>
                </section>
            )}

            {consent && !settingsOpen && (
                <button type="button" className="cookie-settings-fab" onClick={openSettings}>
                    <Cookie size={16} />
                    <span>Çerez tercihleri</span>
                </button>
            )}

            {settingsOpen && (
                <div
                    className="cookie-settings-backdrop"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.currentTarget === event.target) setSettingsOpen(false);
                    }}
                >
                    <section
                        ref={modalRef}
                        className="cookie-settings-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cookie-settings-title"
                    >
                        <header className="cookie-settings-header">
                            <div>
                                <span className="cookie-consent-kicker">OtoSöz gizlilik merkezi</span>
                                <h2 id="cookie-settings-title" ref={modalTitleRef} tabIndex={-1}>Çerez tercihleri</h2>
                                <p>İzinlerinizi kategori bazında yönetin. Kararınızı daha sonra istediğiniz zaman değiştirebilirsiniz.</p>
                            </div>
                            <button type="button" className="cookie-settings-close" onClick={() => setSettingsOpen(false)} aria-label="Tercih penceresini kapat">
                                <X size={19} />
                            </button>
                        </header>

                        <div className="cookie-settings-status">
                            <ShieldCheck size={17} />
                            <span>Varsayılan olarak yalnızca zorunlu çerezler açık.</span>
                            <Link href="/cerez-politikasi">Ayrıntıları gör</Link>
                        </div>

                        <div className="cookie-preferences-list">
                            <PreferenceRow
                                icon={LockKeyhole}
                                title="Kesinlikle gerekli"
                                meta="Her zaman açık"
                                description="Güvenli oturum, hesap girişi, tercih kaydı ve açıkça istediğiniz site özelliklerinin çalışması için gereklidir."
                                enabled
                                locked
                            />
                            <PreferenceRow
                                icon={BarChart3}
                                title="Analiz ve performans"
                                meta="Google Analytics"
                                description="Hangi sayfaların işe yaradığını toplu istatistiklerle anlamamızı sağlar. İzin vermeden Google Analytics yüklenmez."
                                enabled={draft.analytics}
                                onToggle={() => setDraft((current) => ({ ...current, analytics: !current.analytics }))}
                            />
                            <PreferenceRow
                                icon={Megaphone}
                                title="Reklam ve kişiselleştirme"
                                meta="İsteğe bağlı"
                                description="Google reklam sinyalleri ve kişiselleştirme izinlerini yönetir. OtoSöz'ün bağlamsal reklam alanları bu izinden bağımsız çalışabilir."
                                enabled={draft.marketing}
                                onToggle={() => setDraft((current) => ({ ...current, marketing: !current.marketing }))}
                            />
                        </div>

                        <footer className="cookie-settings-footer">
                            <p>Tercih kaydı 180 gün saklanır. Rızanızı geri çektiğinizde gelecekteki ilgili işlemler durdurulur.</p>
                            <div>
                                <button type="button" onClick={rejectOptional}>Gerekli olanlarla devam et</button>
                                <button type="button" onClick={saveDraft}>Seçimleri kaydet</button>
                                <button type="button" onClick={acceptAll}>Tümünü kabul et</button>
                            </div>
                        </footer>
                    </section>
                </div>
            )}
        </>
    );
}
