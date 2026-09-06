import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authGuard";
import { getAdminDb, FieldValue } from "@/lib/firebaseAdmin";

function preferences(value:any) { return { maintenance:value?.maintenance !== false, replies:value?.replies !== false, messages:value?.messages !== false, fuel:value?.fuel !== false }; }
export async function POST(request:Request) {
    const auth = await requireAuth(request); if (auth instanceof NextResponse) return auth;
    const body = await request.json().catch(() => ({}));
    const token = typeof body.token === "string" ? body.token.trim() : "";
    if (token.length < 50 || token.length > 4096) return NextResponse.json({ success:false, message:"Geçersiz bildirim anahtarı." }, { status:400 });
    const db = getAdminDb(); const user = await db.collection("users").doc(auth.uid!).get();
    const id = createHash("sha256").update(`${auth.uid}:${token}`).digest("hex");
    await db.collection("push_subscriptions").doc(id).set({ userId:auth.uid, token, preferences:preferences(body.preferences), city:user.data()?.city || null, platform:"web", updatedAt:FieldValue.serverTimestamp(), createdAt:FieldValue.serverTimestamp() }, { merge:true });
    return NextResponse.json({ success:true });
}
export async function DELETE(request:Request) {
    const auth = await requireAuth(request); if (auth instanceof NextResponse) return auth;
    const body = await request.json().catch(() => ({})); const token = typeof body.token === "string" ? body.token.trim() : "";
    if (!token) return NextResponse.json({ success:false }, { status:400 });
    const id = createHash("sha256").update(`${auth.uid}:${token}`).digest("hex");
    await getAdminDb().collection("push_subscriptions").doc(id).delete(); return NextResponse.json({ success:true });
}
