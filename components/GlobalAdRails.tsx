"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ClosableAdSlot from "@/components/ClosableAdSlot";

const HIDDEN_ROUTE_PREFIXES = ["/admin", "/moderator", "/giris", "/kayit"];
const MIN_RAIL_TOP = 70;

export default function GlobalAdRails() {
    const pathname = usePathname();
    const [hasRailSpace, setHasRailSpace] = useState(false);
    const [railTop, setRailTop] = useState(MIN_RAIL_TOP);
    const [railBottom, setRailBottom] = useState(14);

    useEffect(() => {
        const media = window.matchMedia("(min-width: 1700px) and (min-height: 640px)");
        const update = () => setHasRailSpace(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        if (!hasRailSpace) return;

        let frame = 0;
        const updateRailTop = () => {
            const navbar = document.querySelector<HTMLElement>("nav");
            const navbarBottom = navbar ? Math.ceil(navbar.getBoundingClientRect().bottom) : MIN_RAIL_TOP - 12;
            const stickyTop = Math.max(MIN_RAIL_TOP, navbarBottom + 16);
            const explicitAnchor = document.querySelector<HTMLElement>("[data-ad-rail-anchor]");
            const main = document.querySelector<HTMLElement>("main");
            const pageContainer = navbar?.nextElementSibling instanceof HTMLElement ? navbar.nextElementSibling : null;
            const contentRoot = main || pageContainer;
            const heading = contentRoot?.querySelector<HTMLElement>("h1") || null;
            const namedHeader = heading?.closest<HTMLElement>('[data-page-header], header, [class*="hero"], .forum-thread-header, .expert-detail-header-inner') || null;
            const firstChild = contentRoot?.firstElementChild instanceof HTMLElement ? contentRoot.firstElementChild : null;
            const compactFirstChild = firstChild && heading && firstChild.contains(heading) && firstChild.getBoundingClientRect().height <= 560 ? firstChild : null;
            const headingBoundary = namedHeader || compactFirstChild || heading?.parentElement;

            let targetTop = stickyTop;
            if (explicitAnchor) {
                targetTop = Math.round(explicitAnchor.getBoundingClientRect().top);
            } else if (headingBoundary) {
                targetTop = Math.round(headingBoundary.getBoundingClientRect().bottom + 24);
            } else if (contentRoot) {
                const paddingTop = Number.parseFloat(window.getComputedStyle(contentRoot).paddingTop || "0");
                targetTop = Math.round(contentRoot.getBoundingClientRect().top + paddingTop);
            }

            // Reklam başlık alanının altında başlar; kaydırmada topbar'ın alt sınırını geçmez.
            const viewportLimit = Math.max(stickyTop, window.innerHeight - 430);
            const nextTop = Math.min(Math.max(stickyTop, targetTop), viewportLimit);
            const footer = document.querySelector<HTMLElement>("footer");
            const nextBottom = footer && footer.getBoundingClientRect().top < window.innerHeight
                ? Math.max(14, Math.round(window.innerHeight - footer.getBoundingClientRect().top + 18))
                : 14;
            setRailTop((current) => current === nextTop ? current : nextTop);
            setRailBottom((current) => current === nextBottom ? current : nextBottom);
        };
        const scheduleUpdate = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(updateRailTop);
        };

        updateRailTop();
        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate);

        const observed = document.querySelector<HTMLElement>("[data-ad-rail-anchor]") || document.querySelector<HTMLElement>("main") || (document.querySelector<HTMLElement>("nav")?.nextElementSibling as HTMLElement | null);
        const observer = observed && typeof ResizeObserver !== "undefined" ? new ResizeObserver(scheduleUpdate) : null;
        if (observed && observer) observer.observe(observed);

        // Firestore/veri tabanlı sayfalar önce yükleme görünümünü, ardından gerçek başlığı basar.
        // İçerik değiştiği anda ray sınırlarını yeniden ölçerek başlığın yanında kalmasını önler.
        const mutationObserver = typeof MutationObserver !== "undefined"
            ? new MutationObserver(scheduleUpdate)
            : null;
        if (mutationObserver) mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
            observer?.disconnect();
            mutationObserver?.disconnect();
        };
    }, [hasRailSpace, pathname]);

    const isHiddenRoute = HIDDEN_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    const isForumHome = pathname === "/";
    if (!hasRailSpace || isHiddenRoute) return null;

    return (
        <div className={`global-ad-rails${isForumHome ? " global-ad-rails-forum" : ""}`} aria-label="Sponsorlu reklam alanları">
            <aside className="global-ad-rail global-ad-rail-left" aria-label="Sol reklam alanı" style={{ top: railTop, bottom: railBottom }}>
                <div className="global-ad-rail-shell">
                    <div className="global-ad-rail-title">Reklam</div>
                    <ClosableAdSlot position="global_rail_left" dismissKey="global_rail_left" variant="rail" fallbackTitle="Bu alana reklam ver" fallbackDesc="Otomobil topluluğuna her sayfada ulaşın." />
                </div>
            </aside>
            <aside className="global-ad-rail global-ad-rail-right" aria-label="Sağ reklam alanı" style={{ top: railTop, bottom: railBottom }}>
                <div className="global-ad-rail-shell">
                    <div className="global-ad-rail-title">Reklam</div>
                    <ClosableAdSlot position="global_rail_right" dismissKey="global_rail_right" variant="rail" fallbackTitle="Bu alana reklam ver" fallbackDesc="Otomobil topluluğuna her sayfada ulaşın." />
                </div>
            </aside>
        </div>
    );
}
