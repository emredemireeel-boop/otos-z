import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authGuard";
import { getAdminDb, FieldValue } from "@/lib/firebaseAdmin";
import { LAUNCH_CAMPAIGN, isLaunchCampaignActive } from "@/lib/campaign";

export async function POST(request: Request) {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    if (!isLaunchCampaignActive()) return NextResponse.json({ success:false, message:"Lansman kampanyası sona erdi." }, { status:410 });
    const db = getAdminDb();
    let claimed = false;
    await db.runTransaction(async tx => {
        const ref = db.collection("users").doc(auth.uid!);
        const snap = await tx.get(ref);
        if (!snap.exists) throw new Error("Kullanıcı bulunamadı.");
        if (snap.data()?.campaignBonuses?.launchShareAt) return;
        claimed = true;
        tx.update(ref, { "campaignBonuses.launchShareAt":new Date().toISOString(), xp:FieldValue.increment(LAUNCH_CAMPAIGN.shareBonus), weeklyXP:FieldValue.increment(LAUNCH_CAMPAIGN.shareBonus), monthlyXP:FieldValue.increment(LAUNCH_CAMPAIGN.shareBonus), badges:FieldValue.arrayUnion("OtoSöz Elçisi") });
        tx.create(db.collection("notifications").doc(), { userId:auth.uid, type:"achievement", title:"OtoSöz Elçisi", message:`Lansman paylaşımın için +${LAUNCH_CAMPAIGN.shareBonus} XP kazandın.`, read:false, createdAt:FieldValue.serverTimestamp(), link:"/bilgi-yarismasi", source:"launch_campaign" });
    });
    return NextResponse.json({ success:true, claimed, xp:claimed ? LAUNCH_CAMPAIGN.shareBonus : 0, message:claimed ? "+50 XP hesabına eklendi." : "Paylaşım bonusunu daha önce aldın." });
}
