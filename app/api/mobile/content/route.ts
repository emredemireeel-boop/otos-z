import { NextRequest, NextResponse } from "next/server";

import { curatedSurveys } from "@/data/curated-surveys";
import { events, eventCategories } from "@/data/events";
import { categories as trustCategories } from "@/data/guvenmetre";
import { turkeyBrandMarkets, turkeyModelMarkets } from "@/data/markets";
import newsData from "@/public/data/news_posts.json";
import { getAltinAnahtarMasters } from "@/lib/altinAnahtar";
import { createSlug, vehicleDNAData } from "@/data/vehicle-dna";

export const revalidate = 900;

const supportedModules = new Set([
  "news",
  "events",
  "surveys",
  "trust",
  "masters",
  "markets",
  "vehicle-dna",
]);

const mobileVehiclePaths = new Set([
  "renault/clio-5-nesil-2020-2025",
  "fiat/egea-1-nesil-2015-2025",
  "toyota/corolla-12-nesil-2019-2025",
  "renault/megane-4-nesil-2016-2025",
  "volkswagen/passat-b8-2015-2023",
]);

export async function GET(request: NextRequest) {
  const moduleName = request.nextUrl.searchParams.get("module") ?? "";
  if (!supportedModules.has(moduleName)) {
    return NextResponse.json(
      { success: false, message: "Desteklenmeyen mobil içerik modülü." },
      { status: 400 },
    );
  }

  const payload = await (async () => {
    switch (moduleName) {
      case "news":
        return { items: newsData.posts };
      case "events":
        return { items: events, categories: eventCategories };
      case "surveys":
        return { items: curatedSurveys };
      case "trust":
        return { items: trustCategories };
      case "masters":
        return { items: await getAltinAnahtarMasters() };
      case "markets":
        return {
          brands: turkeyBrandMarkets,
          models: turkeyModelMarkets,
        };
      case "vehicle-dna":
        return {
          items: vehicleDNAData
            .map((vehicle) => ({
              id: vehicle.id,
              brand: vehicle.brand,
              model: vehicle.model,
              years: vehicle.year,
              slug: `${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}`,
              score: vehicle.dnaScore,
              summary: `${vehicle.brand} ${vehicle.model} için motor-şanzıman seçimi, bakım geçmişi ve kronik konu raporlarını birlikte değerlendirin.`,
              strengths: vehicle.strengths,
              risks: vehicle.weaknesses,
              chronicIssues: vehicle.chronicIssues.map((issue) => ({
                title: issue.title,
                severity: issue.severity,
                reportCount: issue.reportCount,
                description: issue.description,
              })),
              totalReports: vehicle.totalReports,
              ncapStars: vehicle.ncapStars,
              ncapYear: vehicle.ncapYear,
            }))
            .filter((vehicle) => mobileVehiclePaths.has(vehicle.slug)),
        };
      default:
        return {};
    }
  })();

  return NextResponse.json(
    {
      success: true,
      module: moduleName,
      updatedAt: new Date().toISOString(),
      ...payload,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400",
      },
    },
  );
}
