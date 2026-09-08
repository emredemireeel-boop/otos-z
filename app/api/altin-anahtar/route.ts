import { NextResponse } from "next/server";

import { getAltinAnahtarMasters } from "@/lib/altinAnahtar";

export const dynamic = "force-dynamic";

export async function GET() {
  const masters = await getAltinAnahtarMasters();
  return NextResponse.json(
    { success: true, masters, updatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
