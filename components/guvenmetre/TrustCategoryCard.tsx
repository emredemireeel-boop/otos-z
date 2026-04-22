"use client";

import Link from "next/link";
import { TrustCategory } from "@/data/guvenmetre";
import { Store, ArrowRight, Fuel, ShieldCheck, Wrench, Building2, PackageOpen, ShoppingBag, Droplets, Car } from "lucide-react";

// Icon mapping
const iconMap: Record<string, any> = {
    "Fuel": Fuel,
    "ShieldCheck": ShieldCheck,
    "Wrench": Wrench,
    "Building2": Building2,
    "Store": Store,
    "PackageOpen": PackageOpen,
    "ShoppingBag": ShoppingBag,
    "Droplets": Droplets,
    "Car": Car
};

export default function TrustCategoryCard({ category }: { category: TrustCategory }) {
    const IconComponent = iconMap[category.icon] || Store;

    return (
        <Link
            href={`/guvenmetre/${category.id}`}
            className="group relative h-full block"
        >
            <div className="relative h-full overflow-hidden rounded-[20px] bg-neutral-900 border border-neutral-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                {/* Background Gradient */}
                <div
                    className="absolute inset-0 opacity-100 transition-opacity duration-300"
                    style={{
                        background: `linear-gradient(135deg, ${category.colors[0]}, ${category.colors[1]})`
                    }}
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/20" />

                <div className="relative p-6 h-full flex flex-col justify-between">
                    {/* Top Section */}
                    <div className="flex justify-between items-start">
                        <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center backdrop-blur-sm">
                            <IconComponent className="w-7 h-7 text-white" />
                        </div>

                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-8 space-y-3">
                        <h3 className="text-xl font-bold text-white leading-tight">
                            {category.title}
                        </h3>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm w-fit">
                            <Store className="w-3.5 h-3.5 text-white" />
                            <span className="text-xs font-semibold text-white">
                                {category.stats}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
