"use client";

import { BrandRating } from "@/data/guvenmetre";
import { Star, TrendingUp, TrendingDown, Minus, Users, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function BrandRankingCard({
    brand,
    rank,
    categoryId
}: {
    brand: BrandRating,
    rank: number,
    categoryId: string
}) {
    const isTop3 = rank <= 3;

    return (
        <Link
            href={`/guvenmetre/${categoryId}/${brand.id}`}
            className="block group"
        >
            <div className="bg-[var(--card-bg)] rounded-2xl p-4 md:p-5 flex items-center gap-4 border border-[var(--card-border)] hover:border-[var(--primary)]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/10">
                {/* Rank */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isTop3 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-[var(--secondary)] text-[var(--text-muted)]'
                    }`}>
                    <span className="text-xl font-bold">#{rank}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
                        {brand.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm mt-1">
                        <div className="flex items-center gap-1.5 ">
                            <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${i <= Math.round(brand.rating)
                                                ? 'fill-yellow-500 text-yellow-500'
                                                : 'fill-neutral-800 text-neutral-800'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="font-bold text-yellow-500 ml-1">{brand.rating === 0 ? '—' : brand.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-neutral-500">
                            <Users className="w-3.5 h-3.5" />
                            <span>{brand.totalReviews === 0 ? 'Henüz oy yok' : brand.totalReviews >= 1000 ? `${(brand.totalReviews / 1000).toFixed(1)}K` : brand.totalReviews}</span>
                        </div>
                    </div>
                </div>

                {/* Trend & Action */}
                <div className="flex flex-col items-end gap-1">
                    {brand.trend === 'up' && <TrendingUp className="w-6 h-6 text-green-500" />}
                    {brand.trend === 'down' && <TrendingDown className="w-6 h-6 text-red-500" />}
                    {brand.trend === 'stable' && <Minus className="w-6 h-6 text-neutral-600" />}

                    <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all mt-auto" />
                </div>
            </div>
        </Link>
    );
}
