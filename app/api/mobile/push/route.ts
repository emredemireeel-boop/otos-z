import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authGuard";
import { getAdminDb, FieldValue } from "@/lib/firebaseAdmin";
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizePreferences(value: unknown) {
    const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
    return {
        maintenance: input.maintenance !== false,
        replies: input.replies !== false,
        messages: input.messages !== false,
        fuel: input.fuel !== false,
    };
}

async function subscriptionId(uid: string, token: string) {
    return createHash("sha256").update(`${uid}:${token}`).digest("hex");
}

export async function POST(request: Request) {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const rate = checkRateLimit(`mobile-push:${auth.uid}:${getClientIP(request)}`, RATE_LIMITS.general);
    if (!rate.allowed) return NextResponse.json({ success: false, message: "Çok fazla istek." }, { status: 429 });
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const token = typeof body.token === "string" ? body.token.trim() : "";
    if (token.length < 50 || token.length > 4096) return NextResponse.json({ success: false, message: "Geçersiz bildirim anahtarı." }, { status: 400 });

    const db = getAdminDb();
    const id = await subscriptionId(auth.uid!, token);
    const ref = db.collection("push_subscriptions").doc(id);
    const [existing, user] = await Promise.all([ref.get(), db.collection("users").doc(auth.uid!).get()]);
    await ref.set({
        userId: auth.uid,
        token,
        preferences: normalizePreferences(body.preferences),
        city: user.data()?.city || null,
        platform: "android",
        appPackage: "com.otosoz.app",
        enabled: true,
        updatedAt: FieldValue.serverTimestamp(),
        ...(existing.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
    }, { merge: true });
    return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const token = typeof body.token === "string" ? body.token.trim() : "";
    if (!token) return NextResponse.json({ success: false }, { status: 400 });
    const id = await subscriptionId(auth.uid!, token);
    await getAdminDb().collection("push_subscriptions").doc(id).delete();
    return NextResponse.json({ success: true });
}
