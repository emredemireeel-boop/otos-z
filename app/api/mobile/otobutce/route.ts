import { NextResponse } from "next/server";

import { OTOBUTCE_CATEGORIES } from "@/data/otobutce-data";

export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      updatedAt: new Date().toISOString(),
      categories: OTOBUTCE_CATEGORIES,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
