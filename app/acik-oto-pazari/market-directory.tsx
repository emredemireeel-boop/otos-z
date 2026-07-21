"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./open-car-markets.module.css";

export interface MarketDirectoryItem {
    name: string;
    slug: string;
    plate: number;
    verifiedCount: number;
    reviewCount: number;
    featured?: boolean;
}

export default function MarketDirectory({ provinces }: { provinces: MarketDirectoryItem[] }) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const normalized = query.trim().toLocaleLowerCase("tr-TR");
        if (!normalized) return provinces;
        return provinces.filter((province) =>
            `${province.plate} ${province.name}`.toLocaleLowerCase("tr-TR").includes(normalized),
        );
    }, [provinces, query]);

    return (
        <section className={styles.directorySection} aria-labelledby="iller-baslik">
            <div className={styles.sectionHeadingRow}>
                <div>
                    <span className={styles.eyebrow}>81 il rehberi</span>
                    <h2 id="iller-baslik">İline göre açık oto pazarı ara</h2>
                </div>
                <label className={styles.searchBox}>
                    <span className="sr-only">İl veya plaka ara</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
                    </svg>
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="İl veya plaka ara…"
                    />
                </label>
            </div>

            <div className={styles.provinceGrid}>
                {filtered.map((province) => {
                    const hasVerified = province.verifiedCount > 0;
                    const hasReview = province.reviewCount > 0;
                    return (
                        <Link
                            key={province.slug}
                            href={`/acik-oto-pazari/${province.slug}`}
                            className={`${styles.provinceCard} ${province.featured ? styles.featuredProvince : ""}`}
                        >
                            <span className={styles.plate}>{String(province.plate).padStart(2, "0")}</span>
                            <span className={styles.provinceName}>{province.name}</span>
                            <span
                                className={`${styles.directoryStatus} ${
                                    hasVerified ? styles.statusVerified : hasReview ? styles.statusReview : styles.statusEmpty
                                }`}
                            >
                                {hasVerified
                                    ? `${province.verifiedCount} doğrulanmış pazar`
                                    : hasReview
                                        ? "Kayıt teyit ediliyor"
                                        : "Güncel kayıt bekleniyor"}
                            </span>
                            <span className={styles.cardArrow} aria-hidden="true">→</span>
                        </Link>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <p className={styles.emptySearch}>“{query}” için il bulunamadı.</p>
            )}
        </section>
    );
}
