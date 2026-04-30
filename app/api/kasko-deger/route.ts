import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Load data lazily to avoid memory issues
let kaskoCache: { guncellenmeTarihi: string; kaynak: string; toplamKayit: number; araclar: Array<{marka: string; model: string; yil: number; deger: number}> } | null = null;

function getKaskoData() {
    if (!kaskoCache) {
        const filePath = path.join(process.cwd(), "data", "kasko_deger.json");
        kaskoCache = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
    return kaskoCache!;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const marka = searchParams.get("marka");
    const model = searchParams.get("model");
    const yil = searchParams.get("yil");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");
    const listMarkalar = searchParams.get("markalar"); // just list brands

    const data = getKaskoData();

    // Return just the list of brands
    if (listMarkalar === "1") {
        const markalar = [...new Set(data.araclar.map(a => a.marka))].sort();
        return NextResponse.json({
            guncellenmeTarihi: data.guncellenmeTarihi,
            kaynak: data.kaynak,
            markalar,
            toplamMarka: markalar.length
        });
    }

    let sonuclar = data.araclar;

    if (marka) {
        sonuclar = sonuclar.filter(a => a.marka.toLocaleLowerCase("tr") === marka.toLocaleLowerCase("tr"));
    }
    if (model) {
        sonuclar = sonuclar.filter(a => a.model.toLocaleLowerCase("tr").includes(model.toLocaleLowerCase("tr")));
    }
    if (yil) {
        sonuclar = sonuclar.filter(a => a.yil === parseInt(yil));
    }

    const toplamSonuc = sonuclar.length;
    sonuclar = sonuclar.sort((a, b) => b.yil - a.yil || a.marka.localeCompare(b.marka)).slice(offset, offset + limit);

    return NextResponse.json({
        guncellenmeTarihi: data.guncellenmeTarihi,
        kaynak: data.kaynak,
        toplamSonuc,
        limit,
        offset,
        sonuclar
    });
}
