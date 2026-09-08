import { NextResponse } from "next/server";
import { getQuizQuestions, quizPeriodKey, type QuizMode } from "@/data/automotive-quiz";
import { getAdminDb, FieldValue } from "@/lib/firebaseAdmin";
import { requireAuth } from "@/lib/authGuard";
import { getXpMultiplier } from "@/lib/campaign";
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rateLimit";

function validMode(value: unknown): value is QuizMode {
    return value === "daily" || value === "weekly";
}

async function leaderboard() {
    const periodKey = quizPeriodKey("weekly");
    const snap = await getAdminDb().collection("quiz_attempts").where("periodKey", "==", periodKey).limit(250).get();
    const ranked = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any))
        .filter((item) => item.mode === "weekly")
        .sort((a, b) => b.correct - a.correct || b.xpAwarded - a.xpAwarded)
        .slice(0, 10);
    const users = await Promise.all(ranked.map((item) => getAdminDb().collection("users").doc(item.userId).get()));
    return ranked.map((item, index) => ({
        rank: index + 1,
        username: users[index].data()?.username || users[index].data()?.displayName || "OtoSöz üyesi",
        correct: item.correct,
        total: item.total,
        xp: item.xpAwarded,
    }));
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const mode = validMode(url.searchParams.get("mode")) ? url.searchParams.get("mode") as QuizMode : "daily";
    const periodKey = quizPeriodKey(mode);
    const questions = getQuizQuestions(mode, periodKey).map(({ correctIndex: _, explanation: __, ...question }) => question);
    return NextResponse.json({ success: true, mode, periodKey, questions, leaderboard: await leaderboard() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => ({}));
    const action = body.action === "check" ? "check" : "complete";
    const clientIP = getClientIP(request);
    const limitState = checkRateLimit(`quiz:${action}:${clientIP}`, action === "check" ? RATE_LIMITS.general : RATE_LIMITS.auth);
    if (!limitState.allowed) return NextResponse.json({ success: false, message: "Çok fazla istek. Kısa bir süre sonra yeniden dene." }, { status: 429 });

    const mode: QuizMode = validMode(body.mode) ? body.mode : "daily";
    const periodKey = quizPeriodKey(mode);
    if (body.periodKey !== periodKey) return NextResponse.json({ success: false, message: "Yarışma süresi yenilendi. Garajı tekrar aç." }, { status: 400 });
    const questions = getQuizQuestions(mode, periodKey);

    if (action === "check") {
        const questionIndex = body.questionIndex;
        const selectedIndex = body.selectedIndex;
        if (!Number.isInteger(questionIndex) || questionIndex < 0 || questionIndex >= questions.length) {
            return NextResponse.json({ success: false, message: "Geçersiz yarışma etabı." }, { status: 400 });
        }
        const question = questions[questionIndex];
        if (body.questionId !== question.id || !Number.isInteger(selectedIndex) || selectedIndex < -1 || selectedIndex >= question.options.length) {
            return NextResponse.json({ success: false, message: "Cevap doğrulanamadı." }, { status: 400 });
        }
        return NextResponse.json({
            success: true,
            questionId: question.id,
            selectedIndex,
            correctIndex: question.correctIndex,
            isCorrect: selectedIndex === question.correctIndex,
            explanation: question.explanation,
        }, { headers: { "Cache-Control": "no-store" } });
    }

    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;
    if (!Array.isArray(body.answers)) return NextResponse.json({ success: false, message: "Tüm etapları tamamla." }, { status: 400 });
    if (body.answers.length !== questions.length || body.answers.some((answer: unknown, index: number) => !Number.isInteger(answer) || Number(answer) < -1 || Number(answer) >= questions[index].options.length)) {
        return NextResponse.json({ success: false, message: "Tüm etapları geçerli bir cevapla tamamla." }, { status: 400 });
    }

    const correct = questions.reduce((total, question, index) => total + (body.answers[index] === question.correctIndex ? 1 : 0), 0);
    const baseXp = correct * (mode === "weekly" ? 10 : 5) + (correct === 10 ? (mode === "weekly" ? 50 : 25) : 0);
    const multiplier = getXpMultiplier();
    const xpAwarded = baseXp * multiplier;
    const attemptId = `${auth.uid}_${mode}_${periodKey}`.replace(/[^a-zA-Z0-9_-]/g, "_");
    const db = getAdminDb();
    let alreadyCompleted = false;

    await db.runTransaction(async (tx) => {
        const attemptRef = db.collection("quiz_attempts").doc(attemptId);
        const attempt = await tx.get(attemptRef);
        if (attempt.exists) {
            alreadyCompleted = true;
            return;
        }
        const userRef = db.collection("users").doc(auth.uid!);
        const user = await tx.get(userRef);
        if (!user.exists) throw new Error("Kullanıcı profili bulunamadı.");
        const badges = ["İlk Quiz"];
        if (correct >= 8) badges.push("Otomotiv Meraklısı");
        if (correct === 10) badges.push("Motor Bilgesi");
        tx.create(attemptRef, { userId: auth.uid, mode, periodKey, correct, total: questions.length, xpAwarded, createdAt: FieldValue.serverTimestamp() });
        tx.update(userRef, { xp: FieldValue.increment(xpAwarded), weeklyXP: FieldValue.increment(xpAwarded), monthlyXP: FieldValue.increment(xpAwarded), badges: FieldValue.arrayUnion(...badges) });
        tx.create(db.collection("notifications").doc(), {
            userId: auth.uid,
            type: "achievement",
            title: "Garaj Ligi tamamlandı",
            message: `${correct}/10 doğru ile ${xpAwarded} XP kazandın${multiplier === 2 ? " (2x lansman bonusu)" : ""}.`,
            read: false,
            createdAt: FieldValue.serverTimestamp(),
            link: "/bilgi-yarismasi",
            source: "quiz",
        });
    });

    if (alreadyCompleted) return NextResponse.json({
        success: false,
        alreadyCompleted: true,
        message: mode === "daily" ? "Bugünkü puanlı turunu tamamladın. Yeni turu antrenman olarak oynayabilirsin." : "Bu haftaki puanlı turunu tamamladın. Yeni turu antrenman olarak oynayabilirsin.",
    }, { status: 409 });

    return NextResponse.json({ success: true, correct, total: questions.length, xpAwarded, multiplier });
}
