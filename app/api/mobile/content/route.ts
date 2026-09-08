import { NextRequest, NextResponse } from "next/server";

import { curatedSurveys } from "@/data/curated-surveys";
import { events, eventCategories } from "@/data/events";
import { categories as trustCategories } from "@/data/guvenmetre";
import { turkeyBrandMarkets, turkeyModelMarkets } from "@/data/markets";
import newsData from "@/public/data/news_posts.json";
import { getAltinAnahtarMasters } from "@/lib/altinAnahtar";

export const revalidate = 900;

const supportedModules = new Set([
  "news",
  "events",
  "surveys",
  "trust",
  "masters",
  "markets",
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
