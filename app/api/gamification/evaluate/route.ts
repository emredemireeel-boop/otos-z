import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authGuard";
import { getAdminDb, FieldValue } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const db = getAdminDb();
    const userRef = db.collection("users").doc(auth.uid!);
    const [userSnap, entriesSnap] = await Promise.all([
        userRef.get(),
        db.collectionGroup("entries").limit(2000).get(),
    ]);
    if (!userSnap.exists) return NextResponse.json({ success:false }, { status:404 });
    const data = userSnap.data() || {};
    const userEntries = entriesSnap.docs.filter(entry => entry.data().authorId === auth.uid);
    const likes = userEntries.reduce((sum, entry) => sum + Number(entry.data().likes || 0), 0);
    const entryCount = userEntries.length;
    const createdAt = data.createdAt?.toDate?.() || (data.createdAt ? new Date(data.createdAt) : null);
    const earned = [];
    if (entryCount >= 1) earned.push("İlk Forum Yazısı");
    if (likes >= 100) earned.push("100 Beğeni");
    if (entryCount >= 50) earned.push("50 Cevap");
    if (createdAt && Date.now() - createdAt.getTime() >= 365 * 86400000) earned.push("1 Yıllık Üye");
    const existing = Array.isArray(data.badges) ? data.badges : [];
    const newBadges = earned.filter(badge => !existing.includes(badge));
    if (newBadges.length) {
        const batch = db.batch();
        batch.update(userRef, { badges:FieldValue.arrayUnion(...newBadges) });
        newBadges.forEach(badge => batch.create(db.collection("notifications").doc(), { userId:auth.uid, type:"achievement", title:"Yeni rozet kazandın", message:`${badge} rozeti profiline eklendi.`, read:false, createdAt:FieldValue.serverTimestamp(), link:`/profil/${auth.uid}`, source:"achievement" }));
        await batch.commit();
    }
    return NextResponse.json({ success:true, newBadges, metrics:{ entryCount, likes } });
}
