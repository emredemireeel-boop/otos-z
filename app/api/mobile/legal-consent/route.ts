import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/authGuard";
import { FieldValue, getAdminDb } from "@/lib/firebaseAdmin";
import { checkRateLimit, getClientIP, RATE_LIMITS } from "@/lib/rateLimit";

const CURRENT_LEGAL_VERSION = "2026-04-01";

export async function POST(request: Request) {
  const limit = checkRateLimit(
    `mobile-legal-consent:${getClientIP(request)}`,
    RATE_LIMITS.auth,
  );
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, message: "Çok fazla istek. Kısa bir süre sonra yeniden dene." },
      { status: 429 },
    );
  }

  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  if (
    body.acceptedTerms !== true ||
    body.acceptedPrivacy !== true ||
    body.version !== CURRENT_LEGAL_VERSION
  ) {
    return NextResponse.json(
      { success: false, message: "Güncel kullanım şartları ve gizlilik politikası onayı gerekli." },
      { status: 400 },
    );
  }

  await getAdminDb().collection("user_private").doc(auth.uid!).set(
    {
      email: auth.email ?? "",
      termsAcceptedAt: FieldValue.serverTimestamp(),
      privacyAcceptedAt: FieldValue.serverTimestamp(),
      legalDocumentVersion: CURRENT_LEGAL_VERSION,
      legalConsentSource: "android",
      acceptedLegalDocuments: ["terms", "privacy"],
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return NextResponse.json({
    success: true,
    legalDocumentVersion: CURRENT_LEGAL_VERSION,
  });
}
