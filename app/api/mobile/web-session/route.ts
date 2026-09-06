import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authGuard";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const rate = checkRateLimit(`mobile-web-session:${auth.uid}:${getClientIP(request)}`, RATE_LIMITS.general);
    if (!rate.allowed) return NextResponse.json({ success: false, message: "Çok fazla oturum isteği." }, { status: 429 });

    try {
        const customToken = await getAdminAuth().createCustomToken(auth.uid!, {
            source: "otosoz_android",
        });
        return NextResponse.json({ success: true, customToken });
    } catch (error) {
        console.error("Mobile web session error:", error);
        return NextResponse.json({ success: false, message: "Web oturumu oluşturulamadı." }, { status: 500 });
    }
}
