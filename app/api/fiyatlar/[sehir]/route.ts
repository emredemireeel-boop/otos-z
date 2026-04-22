import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Basit In-Memory Cache (API Route icinde)
// Not: Next.js dev modunda hot-reload sirasinda silinebilir ama prod'da RAM'de kalir.
const cache = new Map<string, { data: any; time: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 dakika

const SEHIRLER: Record<string, string> = {
    "adana": "adana", "adiyaman": "adiyaman", "afyon": "afyon", "afyonkarahisar": "afyon",
    "agri": "agri", "amasya": "amasya", "ankara": "ankara", "antalya": "antalya",
    "artvin": "artvin", "aydin": "aydin", "balikesir": "balikesir", "bilecik": "bilecik",
    "bingol": "bingol", "bitlis": "bitlis", "bolu": "bolu", "burdur": "burdur",
    "bursa": "bursa", "canakkale": "canakkale", "cankiri": "cankiri", "corum": "corum",
    "denizli": "denizli", "diyarbakir": "diyarbakir", "edirne": "edirne", "elazig": "elazig",
    "erzincan": "erzincan", "erzurum": "erzurum", "eskisehir": "eskisehir", "gaziantep": "gaziantep",
    "giresun": "giresun", "gumushane": "gumushane", "hakkari": "hakkari", "hatay": "hatay",
    "isparta": "isparta", "mersin": "mersin", "istanbul": "istanbul", "izmir": "izmir",
    "kars": "kars", "kastamonu": "kastamonu", "kayseri": "kayseri", "kirklareli": "kirklareli",
    "kirsehir": "kirsehir", "kocaeli": "kocaeli", "konya": "konya", "kutahya": "kutahya",
    "malatya": "malatya", "manisa": "manisa", "kahramanmaras": "kahramanmaras", "mardin": "mardin",
    "mugla": "mugla", "mus": "mus", "nevsehir": "nevsehir", "nigde": "nigde",
    "ordu": "ordu", "rize": "rize", "sakarya": "sakarya", "samsun": "samsun",
    "siirt": "siirt", "sinop": "sinop", "sivas": "sivas", "tekirdag": "tekirdag",
    "tokat": "tokat", "trabzon": "trabzon", "tunceli": "tunceli", "sanliurfa": "sanliurfa",
    "usak": "usak", "van": "van", "yozgat": "yozgat", "zonguldak": "zonguldak",
    "aksaray": "aksaray", "bayburt": "bayburt", "karaman": "karaman", "kirikkale": "kirikkale",
    "batman": "batman", "sirnak": "sirnak", "bartin": "bartin", "ardahan": "ardahan",
    "igdir": "igdir", "yalova": "yalova", "karabuk": "karabuk", "kilis": "kilis",
    "osmaniye": "osmaniye", "duzce": "duzce"
};

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sehir: string }> } // In Next.js 15+ params is a Promise
) {
    try {
        const p = await params;
        const sehirParam = p.sehir.toLowerCase();
        const slug = SEHIRLER[sehirParam];

        if (!slug) {
            return NextResponse.json(
                { hata: true, mesaj: "Geçersiz şehir adı veya harf hatası", girilen: sehirParam },
                { status: 404 }
            );
        }

        const url = `https://www.petrolofisi.com.tr/akaryakit-fiyatlari/${slug}-akaryakit-fiyatlari`;
        const cacheKey = `fiyatlar_${slug}`;

        // Cache kontrolü
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.time < CACHE_TTL) {
            return NextResponse.json(cached.data);
        }

        // Axios ile çekim
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 8000
        });

        const html = response.data;
        const $ = cheerio.load(html);

        let table = $('table.table').first();
        if (table.length === 0) {
            table = $('div[id^="element-"] table').first();
        }

        if (table.length === 0) {
            return NextResponse.json(
                { hata: true, mesaj: "Site yapısı değişmiş, tablo bulunamadı." },
                { status: 500 }
            );
        }

        const sutunlar: string[] = [];
        table.find('thead tr:nth-child(1) th').each((i, el) => {
            const h = $(el).text().trim();
            if (i > 0 && h) sutunlar.push(h);
        });

        const veriler: { ilce: string; fiyatlar: Record<string, { fiyat: string; birim: string } | null> }[] = [];
        table.find('tbody tr').each((i, row) => {
            const cells = $(row).find('td');
            if (cells.length > 2) {
                const ilceAdi = $(cells[0]).text().trim();
                const parsePrice = (index: number) => {
                    const text = $(cells[index]).text().trim();
                    if (!text || text === '-' || text === '') return null;
                    const parts = text.split(/\s+/);
                    return parts.length >= 2 ? { fiyat: parts[0], birim: parts[1] } : { fiyat: text, birim: "TL" };
                };

                veriler.push({
                    ilce: ilceAdi,
                    fiyatlar: {
                        benzin_95: parsePrice(1),
                        motorin: parsePrice(2),
                        gazyagi: parsePrice(3),
                        kalorifer_yakiti: parsePrice(4),
                        fuel_oil: parsePrice(5),
                        lpg_otogaz: parsePrice(6),
                    }
                });
            }
        });

        const sonuc = {
            hata: false,
            sehir: slug.toUpperCase(),
            kaynak: "Petrol Ofisi",
            url: url,
            tarih: new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' }),
            sutunlar,
            toplamIlce: veriler.length,
            veriler
        };

        if (veriler.length > 0) {
            cache.set(cacheKey, { data: sonuc, time: Date.now() });
        }

        return NextResponse.json(sonuc);

    } catch (error: any) {
        console.error("API Havuz Hatasi:", error.message);
        return NextResponse.json(
            { hata: true, mesaj: "Sunucu hatası veya hedef siteye ulaşılamadı", detay: error.message },
            { status: 500 }
        );
    }
}
