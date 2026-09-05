import { NextResponse } from "next/server";
import { getQuizQuestions, quizPeriodKey, type QuizMode } from "@/data/automotive-quiz";
import { getAdminDb, FieldValue } from "@/lib/firebaseAdmin";
import { requireAuth } from "@/lib/authGuard";
import { getXpMultiplier } from "@/lib/campaign";
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rateLimit";

function validMode(value: unknown): value is QuizMode { return value === "daily" || value === "weekly"; }

async function leaderboard() {
    const periodKey = quizPeriodKey("weekly");
    const snap = await getAdminDb().collection("quiz_attempts").where("periodKey", "==", periodKey).limit(250).get();
    const ranked = snap.docs.map(doc => ({ id:doc.id, ...doc.data() } as any))
        .filter(item => item.mode === "weekly")
        .sort((a, b) => b.correct - a.correct || b.xpAwarded - a.xpAwarded)
        .slice(0, 10);
    const users = await Promise.all(ranked.map(item => getAdminDb().collection("users").doc(item.userId).get()));
    return ranked.map((item, index) => ({
        rank:index + 1,
        username:users[index].data()?.username || users[index].data()?.displayName || "OtoSöz üyesi",
        correct:item.correct,
        total:item.total,
        xp:item.xpAwarded,
    }));
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const mode = validMode(url.searchParams.get("mode")) ? url.searchParams.get("mode") as QuizMode : "daily";
    const periodKey = quizPeriodKey(mode);
    const questions = getQuizQuestions(mode, periodKey).map(({ correctIndex:_, explanation:__, ...question }) => question);
    return NextResponse.json({ success:true, mode, periodKey, questions, leaderboard:await leaderboard() }, { headers:{ "Cache-Control":"no-store" } });
}

export async function POST(request: Request) {
    const limitState = checkRateLimit(`quiz:${getClientIP(request)}`, RATE_LIMITS.auth);
    if (!limitState.allowed) return NextResponse.json({ success:false, message:"Çok fazla deneme." }, { status:429 });
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    const body = await request.json().catch(() => ({}));
    const mode: QuizMode = validMode(body.mode) ? body.mode : "daily";
    const periodKey = quizPeriodKey(mode);
    if (body.periodKey !== periodKey || !Array.isArray(body.answers)) return NextResponse.json({ success:false, message:"Yarışma süresi yenilendi. Soruları tekrar açın." }, { status:400 });
    const questions = getQuizQuestions(mode, periodKey);
    if (body.answers.length !== questions.length || body.answers.some((answer:unknown) => !Number.isInteger(answer))) return NextResponse.json({ success:false, message:"Tüm soruları cevaplayın." }, { status:400 });
    const correct = questions.reduce((total, question, index) => total + (body.answers[index] === question.correctIndex ? 1 : 0), 0);
    const baseXp = correct * (mode === "weekly" ? 10 : 5) + (correct === 10 ? (mode === "weekly" ? 50 : 25) : 0);
    const multiplier = getXpMultiplier();
    const xpAwarded = baseXp * multiplier;
    const attemptId = `${auth.uid}_${mode}_${periodKey}`.replace(/[^a-zA-Z0-9_-]/g, "_");
    const db = getAdminDb();
    let alreadyCompleted = false;
    await db.runTransaction(async tx => {
        const attemptRef = db.collection("quiz_attempts").doc(attemptId);
        const attempt = await tx.get(attemptRef);
        if (attempt.exists) { alreadyCompleted = true; return; }
        const userRef = db.collection("users").doc(auth.uid!);
        const user = await tx.get(userRef);
        if (!user.exists) throw new Error("Kullanıcı profili bulunamadı.");
        const badges = ["İlk Quiz"];
        if (correct >= 8) badges.push("Otomotiv Meraklısı");
        if (correct === 10) badges.push("Motor Bilgesi");
        tx.create(attemptRef, { userId:auth.uid, mode, periodKey, correct, total:questions.length, xpAwarded, createdAt:FieldValue.serverTimestamp() });
        tx.update(userRef, { xp:FieldValue.increment(xpAwarded), weeklyXP:FieldValue.increment(xpAwarded), monthlyXP:FieldValue.increment(xpAwarded), badges:FieldValue.arrayUnion(...badges) });
        tx.create(db.collection("notifications").doc(), { userId:auth.uid, type:"achievement", title:"Bilgi yarışması tamamlandı", message:`${correct}/10 doğru ile ${xpAwarded} XP kazandın${multiplier === 2 ? " (2x lansman bonusu)" : ""}.`, read:false, createdAt:FieldValue.serverTimestamp(), link:"/bilgi-yarismasi", source:"quiz" });
    });
    if (alreadyCompleted) return NextResponse.json({ success:false, alreadyCompleted:true, message:mode === "daily" ? "Bugünkü yarışmayı zaten tamamladın." : "Bu haftaki yarışmayı zaten tamamladın." }, { status:409 });
    return NextResponse.json({ success:true, correct, total:questions.length, xpAwarded, multiplier, results:questions.map((q, index) => ({ id:q.id, correctIndex:q.correctIndex, selectedIndex:body.answers[index], isCorrect:q.correctIndex === body.answers[index], explanation:q.explanation })) });
}
