import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authGuard";
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rateLimit";
import {
    addMobileReply,
    createMobileThread,
    incrementMobileView,
    toggleMobileLike,
    toggleMobileVehicleVote,
} from "@/lib/mobileForumServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Action = "createThread" | "addReply" | "toggleLike" | "vehicleVote" | "incrementView";

function isAction(value: unknown): value is Action {
    return ["createThread", "addReply", "toggleLike", "vehicleVote", "incrementView"].includes(String(value));
}
function refreshForum(slug?: string) {
    revalidatePath("/forum");
    revalidatePath("/forum/feed.xml");
    revalidatePath("/sitemap.xml");
    if (slug) revalidatePath(`/forum/${slug}`);
}

export async function POST(request: Request) {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 32_768) return NextResponse.json({ success: false, message: "İstek çok büyük." }, { status: 413 });
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    if (!isAction(body.action)) return NextResponse.json({ success: false, message: "Geçersiz işlem." }, { status: 400 });

    if (body.action === "incrementView") {
        const rate = checkRateLimit(`mobile-view:${getClientIP(request)}`, RATE_LIMITS.general);
        if (!rate.allowed) return NextResponse.json({ success: false, message: "Çok fazla istek." }, { status: 429 });
        try {
            return NextResponse.json({ success: true, ...(await incrementMobileView(body)) });
        } catch (error) {
            return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Görüntülenme kaydedilemedi." }, { status: 400 });
        }
    }

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const rate = checkRateLimit(`mobile-forum:${body.action}:${auth.uid}`, RATE_LIMITS.createContent);
    if (!rate.allowed) {
        return NextResponse.json({ success: false, message: "Çok hızlı işlem yapıyorsun. Biraz bekleyip tekrar dene." }, {
            status: 429,
            headers: { "Retry-After": String(Math.ceil((rate.retryAfterMs || 60_000) / 1000)) },
        });
    }

    try {
        if (body.action === "createThread") {
            const result = await createMobileThread(auth.uid!, body);
            refreshForum(result.slug);
            return NextResponse.json({ success: true, ...result });
        }
        if (body.action === "addReply") {
            const result = await addMobileReply(auth.uid!, body);
            refreshForum(result.slug);
            return NextResponse.json({ success: true, ...result });
        }
        if (body.action === "toggleLike") {
            return NextResponse.json({ success: true, ...(await toggleMobileLike(auth.uid!, body)) });
        }
        return NextResponse.json({ success: true, ...(await toggleMobileVehicleVote(auth.uid!, body)) });
    } catch (error) {
        console.error("Mobile forum API error:", error);
        return NextResponse.json({
            success: false,
            message: error instanceof Error ? error.message : "İşlem tamamlanamadı.",
        }, { status: 400 });
    }
}
