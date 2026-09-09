import type { MetadataRoute } from "next";
import trafikCezalariData from "@/data/trafik_cezalari.json";

const BASE_URL = "https://otosoz.com";
const LAST_REVIEWED = new Date("2026-09-09T00:00:00+03:00");

export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
    const detailEntries = trafikCezalariData.categories.flatMap((category) =>
        category.rows.map((fine) => ({
            url: `${BASE_URL}/trafik-cezasi/${fine.slug}`,
            lastModified: LAST_REVIEWED,
            changeFrequency: "monthly" as const,
            priority: 0.75,
        })),
    );

    return [
        {
            url: `${BASE_URL}/trafik-cezasi`,
            lastModified: LAST_REVIEWED,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        ...detailEntries,
    ];
}
