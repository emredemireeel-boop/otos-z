import "server-only";

import { FieldValue, getAdminDb } from "@/lib/firebaseAdmin";
import seedData from "@/public/data/altin_anahtar.json";

export const ALTIN_ANAHTAR_COLLECTION = "altin_anahtar_masters";

export const ALTIN_ANAHTAR_DAYS = [
  "pazartesi", "sali", "carsamba", "persembe", "cuma", "cumartesi", "pazar",
] as const;

export interface AltinAnahtarMaster {
  id: string;
  name: string;
  workshop: string;
  goldenKeys: number;
  specialty: string[];
  city: string;
  district: string;
  area: string;
  address: string;
  phone: string;
  establishedYear?: number;
  experience: number;
  brands: string[];
  description: string;
  rating: number;
  reviewCount: number;
  googleRating: number;
  googleReviews: number;
  hours: Record<string, string>;
  services: string[];
  lat?: number;
  lng?: number;
  mapUrl?: string;
  website?: string;
  createdAt: string;
}

const seedMasters = (seedData.masters as AltinAnahtarMaster[]).map((master) => ({
  ...master,
  address: master.address || "",
  googleRating: master.googleRating ?? master.rating ?? 0,
  googleReviews: master.googleReviews ?? master.reviewCount ?? 0,
  hours: master.hours || {},
  services: master.services || [],
  specialty: master.specialty || [],
  brands: master.brands || [],
  createdAt: master.createdAt || new Date().toISOString().slice(0, 10),
}));

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanList(value: unknown, maxItems = 30, maxLength = 80): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.map((item) => cleanText(item, maxLength)).filter(Boolean))).slice(0, maxItems);
}

function cleanNumber(value: unknown, fallback: number, min: number, max: number, integer = false): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return fallback;
  const bounded = Math.min(max, Math.max(min, number));
  return integer ? Math.round(bounded) : Math.round(bounded * 10) / 10;
}

function optionalCoordinate(value: unknown, min: number, max: number): number | undefined {
  if (value === "" || value === null || typeof value === "undefined") return undefined;
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new Error("Konum koordinatları geçerli aralıkta olmalıdır.");
  return number;
}

function cleanHttpsUrl(value: unknown, kind: "map" | "website"): string | undefined {
  const raw = cleanText(value, 1_000);
  if (!raw) return undefined;
  let parsed: URL;
  try { parsed = new URL(raw); }
  catch { throw new Error(kind === "map" ? "Harita bağlantısı geçerli değil." : "Web sitesi bağlantısı geçerli değil."); }
  if (parsed.protocol !== "https:") throw new Error("Bağlantı HTTPS ile başlamalıdır.");
  if (kind === "map" && !isAllowedMapHost(parsed.hostname)) {
    throw new Error("Yalnızca Google Maps, Apple Maps veya Yandex Maps bağlantısı kullanılabilir.");
  }
  return parsed.toString();
}

function slugify(value: string): string {
  const turkish: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return value.split("").map((char) => turkish[char] || char).join("").toLowerCase()
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "").slice(0, 70);
}

export function isAllowedMapHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === "google.com" || host === "www.google.com" || host === "maps.google.com" ||
    host.endsWith(".google.com") || host === "maps.app.goo.gl" || host === "goo.gl" ||
    host === "maps.apple.com" || host === "yandex.com" || host === "yandex.com.tr" ||
    host === "yandex.ru" || host === "www.yandex.com.tr";
}

export function extractCoordinatesFromMapValue(value: string): { lat: number; lng: number } | null {
  const decoded = (() => { try { return decodeURIComponent(value); } catch { return value; } })();
  const patterns = [
    /@(-?\d{1,2}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/,
    /!3d(-?\d{1,2}(?:\.\d+)?)[^!]*!4d(-?\d{1,3}(?:\.\d+)?)/,
    /(?:^|[?&#/])(q|query|center|destination)=(-?\d{1,2}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)/i,
    /^\s*(-?\d{1,2}(?:\.\d+)?)\s*[,;]\s*(-?\d{1,3}(?:\.\d+)?)\s*$/,
  ];
  for (const pattern of patterns) {
    const match = decoded.match(pattern);
    if (!match) continue;
    const offset = match.length === 4 ? 1 : 0;
    const lat = Number(match[1 + offset]);
    const lng = Number(match[2 + offset]);
    if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
  }
  try {
    const parsed = new URL(decoded);
    const ll = parsed.searchParams.get("ll");
    if (ll) {
      const parts = ll.split(",").map(Number);
      if (parts.length === 2 && parts.every(Number.isFinite)) {
        const yandex = parsed.hostname.toLowerCase().includes("yandex");
        const lat = yandex ? parts[1] : parts[0];
        const lng = yandex ? parts[0] : parts[1];
        if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) return { lat, lng };
      }
    }
  } catch { /* Düz koordinat girişi URL olmak zorunda değildir. */ }
  return null;
}

export function sanitizeAltinAnahtarMaster(value: unknown, requestedId?: string): AltinAnahtarMaster {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const name = cleanText(raw.name, 140);
  const city = cleanText(raw.city, 60);
  const address = cleanText(raw.address, 300);
  const phone = cleanText(raw.phone, 40);
  if (!name || !city || !address || !phone) throw new Error("Firma adı, şehir, açık adres ve telefon zorunludur.");

  const currentYear = new Date().getFullYear();
  const establishedYear = cleanNumber(raw.establishedYear, currentYear, 1900, currentYear, true);
  const lat = optionalCoordinate(raw.lat, -90, 90);
  const lng = optionalCoordinate(raw.lng, -180, 180);
  if ((typeof lat === "number") !== (typeof lng === "number")) throw new Error("Enlem ve boylam birlikte girilmelidir.");

  const hours: Record<string, string> = {};
  const rawHours = raw.hours && typeof raw.hours === "object" ? raw.hours as Record<string, unknown> : {};
  ALTIN_ANAHTAR_DAYS.forEach((day) => { hours[day] = cleanText(rawHours[day], 40) || "Kapalı"; });

  const id = requestedId || `${slugify(name) || "usta"}-${Date.now()}`;
  return {
    id,
    name,
    workshop: cleanText(raw.workshop, 140) || name,
    goldenKeys: cleanNumber(raw.goldenKeys, 1, 1, 3, true),
    specialty: cleanList(raw.specialty, 30, 60),
    city,
    district: cleanText(raw.district, 80),
    area: cleanText(raw.area, 100),
    address,
    phone,
    establishedYear,
    experience: cleanNumber(raw.experience, Math.max(0, currentYear - establishedYear), 0, 100, true),
    brands: cleanList(raw.brands, 80, 60),
    description: cleanText(raw.description, 1_500),
    rating: cleanNumber(raw.rating, 0, 0, 5),
    reviewCount: cleanNumber(raw.reviewCount, 0, 0, 1_000_000, true),
    googleRating: cleanNumber(raw.googleRating, 0, 0, 5),
    googleReviews: cleanNumber(raw.googleReviews, 0, 0, 1_000_000, true),
    hours,
    services: cleanList(raw.services, 50, 100),
    lat,
    lng,
    mapUrl: cleanHttpsUrl(raw.mapUrl, "map"),
    website: cleanHttpsUrl(raw.website, "website"),
    createdAt: cleanText(raw.createdAt, 20) || new Date().toISOString().slice(0, 10),
  };
}

export async function getAltinAnahtarMasters(): Promise<AltinAnahtarMaster[]> {
  const merged = new Map(seedMasters.map((master) => [master.id, { ...master }]));
  try {
    const snapshot = await getAdminDb().collection(ALTIN_ANAHTAR_COLLECTION).get();
    snapshot.docs.forEach((document) => {
      const data = document.data();
      if (data.deleted === true) { merged.delete(document.id); return; }
      const current = merged.get(document.id) || {};
      try {
        // Firestore denetim alanlarını (updatedBy, deleted vb.) public yanıta taşıma.
        merged.set(document.id, sanitizeAltinAnahtarMaster({ ...current, ...data }, document.id));
      } catch (error) {
        console.error(`Geçersiz Altın Anahtar kaydı atlandı: ${document.id}`, error);
      }
    });
  } catch (error) {
    console.error("Altın Anahtar Firestore verisi okunamadı, yerel veri kullanılıyor:", error);
  }
  return Array.from(merged.values()).sort((a, b) => a.city.localeCompare(b.city, "tr") || a.name.localeCompare(b.name, "tr"));
}

export async function upsertAltinAnahtarMaster(value: unknown, requestedId: string | undefined, actor: string): Promise<AltinAnahtarMaster> {
  const master = sanitizeAltinAnahtarMaster(value, requestedId);
  await getAdminDb().collection(ALTIN_ANAHTAR_COLLECTION).doc(master.id).set({
    ...master, deleted: false, updatedBy: actor, updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
  return master;
}

export async function deleteAltinAnahtarMaster(id: string, actor: string): Promise<void> {
  await getAdminDb().collection(ALTIN_ANAHTAR_COLLECTION).doc(id).set({
    deleted: true, deletedBy: actor, deletedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
}
