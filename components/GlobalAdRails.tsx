"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ClosableAdSlot from "@/components/ClosableAdSlot";

const HIDDEN_ROUTE_PREFIXES = [
    "/admin",
    "/moderator",
    "/giris",
    "/kayit",
];

const MIN_RAIL_TOP = 70;

export default function GlobalAdRails() {
    const pathname = usePathname();
    const [hasRailSpace, setHasRailSpace] = useState(false);
    const [railTop, setRailTop] = useState(MIN_RAIL_TOP);

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
            const anchor = document.querySelector<HTMLElement>("[data-ad-rail-anchor]");
            const nextTop = anchor
                ? Math.max(MIN_RAIL_TOP, Math.round(anchor.getBoundingClientRect().top))
                : MIN_RAIL_TOP;
            setRailTop((current) => current === nextTop ? current : nextTop);
        };
        const scheduleUpdate = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(updateRailTop);
        };

        updateRailTop();
        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate);

        const anchor = document.querySelector<HTMLElement>("[data-ad-rail-anchor]");
        const observer = anchor && typeof ResizeObserver !== "undefined"
            ? new ResizeObserver(scheduleUpdate)
            : null;
        if (anchor && observer) observer.observe(anchor);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", scheduleUpdate);
            window.removeEventListener("resize", scheduleUpdate);
            observer?.disconnect();
        };
    }, [hasRailSpace, pathname]);

    const isHiddenRoute = HIDDEN_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    const isForumHome = pathname === "/";
    if (!hasRailSpace || isHiddenRoute) return null;

    return (
        <div className={`global-ad-rails${isForumHome ? " global-ad-rails-forum" : ""}`} aria-label="Sponsorlu reklam alanları">
            <aside className="global-ad-rail global-ad-rail-left" aria-label="Sol reklam alanı" style={{ top: railTop }}>
                <div className="global-ad-rail-shell">
                    <div className="global-ad-rail-title">Reklam</div>
                    <ClosableAdSlot
                        position="global_rail_left"
                        dismissKey="global_rail_left"
                        variant="rail"
                        fallbackTitle="Bu alana reklam ver"
                        fallbackDesc="Otomobil topluluğuna her sayfada ulaşın."
                    />
                </div>
            </aside>

            <aside className="global-ad-rail global-ad-rail-right" aria-label="Sağ reklam alanı" style={{ top: railTop }}>
                <div className="global-ad-rail-shell">
                    <div className="global-ad-rail-title">Reklam</div>
                    <ClosableAdSlot
                        position="global_rail_right"
                        dismissKey="global_rail_right"
                        variant="rail"
                        fallbackTitle="Bu alana reklam ver"
                        fallbackDesc="Otomobil topluluğuna her sayfada ulaşın."
                    />
                </div>
            </aside>
        </div>
    );
}