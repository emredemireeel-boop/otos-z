import { NextResponse } from "next/server";
import { requireAuth, type AuthResult } from "@/lib/authGuard";
import { FieldValue, getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_FUEL_TYPES = new Set(["Benzin", "Dizel", "Elektrik"]);
const ALLOWED_ITEM_KEYS = new Set([
    "inspection", "insurance", "mtv", "kasko", "maintenance", "oilChange",
    "oilFilter", "airFilter", "trigerBelt", "polenFilter", "fuelFilter", "dpf",
    "sparkPlugs", "brakePads", "brakeFluid", "transmissionFluid", "tireRotation",
    "coolant", "battery",
]);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

interface AgendaItemInput {
    enabled: boolean;
    dueDate: string;
    notify: boolean;
}

interface AgendaInput {
    annualKm: number;
    fuelType: string;
    timezone: string;
    items: Record<string, AgendaItemInput>;
}

function isValidDate(value: string): boolean {
    if (!DATE_PATTERN.test(value)) return false;
    const date = new Date(`${value}T12:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validateAgenda(value: unknown): value is AgendaInput {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const agenda = value as Partial<AgendaInput>;
    if (!Number.isInteger(agenda.annualKm) || agenda.annualKm! < 1000 || agenda.annualKm! > 100000) return false;
    if (typeof agenda.fuelType !== "string" || !ALLOWED_FUEL_TYPES.has(agenda.fuelType)) return false;
    if (agenda.timezone !== "Europe/Istanbul") return false;
    if (!agenda.items || typeof agenda.items !== "object" || Array.isArray(agenda.items)) return false;

    const entries = Object.entries(agenda.items);
    if (entries.length === 0 || entries.length > ALLOWED_ITEM_KEYS.size) return false;
    return entries.every(([key, item]) => (
        ALLOWED_ITEM_KEYS.has(key)
        && !!item
        && typeof item === "object"
        && typeof item.enabled === "boolean"
        && typeof item.notify === "boolean"
        && typeof item.dueDate === "string"
        && isValidDate(item.dueDate)
    ));
}

export async function GET(request: Request) {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    try {
        const uid = (auth as AuthResult).uid!;
        const snapshot = await getAdminDb().collection("maintenance_agendas").doc(uid).get();
        if (!snapshot.exists) {
            return NextResponse.json({ success: true, agenda: null }, {
                headers: { "Cache-Control": "no-store" },
            });
        }

        const data = snapshot.data()!;
        return NextResponse.json({
            success: true,
            agenda: {
                annualKm: data.annualKm,
                fuelType: data.fuelType,
                timezone: "Europe/Istanbul",
                items: data.items,
            },
        }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
        console.error("Bakım ajandası okunamadı:", error);
        return NextResponse.json({ success: false, message: "Bakım ajandası şu anda yüklenemedi." }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 32768) {
        return NextResponse.json({ success: false, message: "Ajanda verisi çok büyük." }, { status: 413 });
    }

    try {
        const body: unknown = await request.json();
        if (!validateAgenda(body)) {
            return NextResponse.json({ success: false, message: "Ajanda bilgileri geçersiz." }, { status: 400 });
        }

        const uid = (auth as AuthResult).uid!;
        await getAdminDb().collection("maintenance_agendas").doc(uid).set({
            userId: uid,
            annualKm: body.annualKm,
            fuelType: body.fuelType,
            timezone: "Europe/Istanbul",
            items: body.items,
            updatedAt: FieldValue.serverTimestamp(),
        }, { merge: true });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Bakım ajandası kaydedilemedi:", error);
        return NextResponse.json({ success: false, message: "Bakım ajandası kaydedilemedi." }, { status: 500 });
    }
}
