import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authGuard";
import { getAdminDb, FieldValue } from "@/lib/firebaseAdmin";
import { LAUNCH_CAMPAIGN, isLaunchCampaignActive } from "@/lib/campaign";

export async function POST(request: Request) {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    if (!isLaunchCampaignActive()) return NextResponse.json({ success:true, active:false });
    const db = getAdminDb();
    let result:any = { success:true, active:true, eligible:false };
    await db.runTransaction(async tx => {
        const userRef = db.collection("users").doc(auth.uid!);
        const campaignRef = db.collection("campaigns").doc(LAUNCH_CAMPAIGN.id);
        const [userSnap, campaignSnap] = await Promise.all([tx.get(userRef), tx.get(campaignRef)]);
        if (!userSnap.exists) throw new Error("Kullanıcı profili bulunamadı.");
        const existing = userSnap.data()?.launchCampaign;
        if (existing?.campaignId === LAUNCH_CAMPAIGN.id) { result = { ...result, eligible:existing.eligible === true, ordinal:existing.ordinal || null }; return; }
        const claimed = Number(campaignSnap.data()?.claimed || 0);
        const eligible = claimed < LAUNCH_CAMPAIGN.memberLimit;
        const ordinal = eligible ? claimed + 1 : null;
        if (eligible) tx.set(campaignRef, { claimed:ordinal, updatedAt:FieldValue.serverTimestamp(), limit:LAUNCH_CAMPAIGN.memberLimit }, { merge:true });
        tx.update(userRef, {
            launchCampaign:{ campaignId:LAUNCH_CAMPAIGN.id, eligible, ordinal, claimedAt:new Date().toISOString() },
            ...(eligible ? { badges:FieldValue.arrayUnion("İlk 1000 Üye") } : {}),
        });
        if (eligible) tx.create(db.collection("notifications").doc(), { userId:auth.uid, type:"achievement", title:"İlk 1000 Üye rozeti", message:`OtoSöz'ün ilk 1000 üyesi arasına ${ordinal}. sıradan katıldın. Lansman boyunca XP'lerin 2x.`, read:false, createdAt:FieldValue.serverTimestamp(), link:"/bilgi-yarismasi", source:"launch_campaign" });
        result = { ...result, eligible, ordinal };
    });
    return NextResponse.json(result);
}
