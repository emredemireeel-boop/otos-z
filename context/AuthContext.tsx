"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    onIdTokenChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { validateUsername } from "@/lib/usernameValidation";
import { validatePassword } from "@/lib/validation";

export type UserRole = "caylak" | "usta" | "admin" | "moderator";

export interface User {
    id: number | string;
    name: string;
    displayName?: string;
    username: string;
    email: string;
    avatar: string | null;
    level: string;
    notifications: number;
    role: UserRole;
    isAdmin?: boolean;
    isModerator?: boolean;
    permissions?: string[];
    firstName?: string;
    lastName?: string;
    birthdate?: string;
    city?: string;
    profileComplete?: boolean;
    xp?: number;
    streak?: number;
}

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    login: (email: string, password: string) => Promise<boolean>;
    loginWithGoogle: () => Promise<{ success: boolean; isNewUser: boolean }>;
    register: (email: string, password: string, username: string, city?: string) => Promise<boolean>;
    completeProfile: (data: { firstName: string; lastName: string; username: string; city: string }) => Promise<boolean>;
    checkUsernameAvailability: (username: string) => Promise<boolean>;
    logout: () => void;
    updateRole: (role: UserRole) => void;
    getIdToken: () => Promise<string | null>;
    isLoading: boolean;
    error: string | null;
    needsProfileCompletion: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ── Firebase User -> App User ── */
async function mapFirebaseUser(fbUser: FirebaseUser): Promise<User> {
    let profile: Record<string, unknown> = {};
    try {
        const snap = await getDoc(doc(db, "users", fbUser.uid));
        if (snap.exists()) {
            profile = snap.data();
        }
    } catch (e) {
        console.warn("Firestore profil okuma hatasi:", e);
    }

    const profileComplete = !!(profile.username && profile.city && profile.profileComplete);

    return {
        id: fbUser.uid,
        name: (profile.displayName as string) || fbUser.displayName || fbUser.email?.split("@")[0] || "Kullanici",
        displayName: (profile.displayName as string) || fbUser.displayName || undefined,
        username: (profile.username as string) || fbUser.email?.split("@")[0] || "user",
        email: fbUser.email || "",
        avatar: (profile.photoURL as string) || fbUser.photoURL || null,
        level: (profile.level as string) || "Yeni Uye",
        notifications: 0,
        role: (profile.role as UserRole) || "caylak",
        isAdmin: (profile.role as string) === "admin",
        isModerator: (profile.role as string) === "moderator",
        city: (profile.city as string) || undefined,
        firstName: (profile.firstName as string) || undefined,
        lastName: (profile.lastName as string) || undefined,
        profileComplete,
        xp: (profile.xp as number) || 0,
        streak: (profile.streak as number) || 0,
    };
}

/* ── Firestore'a profil kaydet ── */
async function saveProfile(uid: string, data: Record<string, unknown>) {
    try {
        await setDoc(doc(db, "users", uid), data, { merge: true });
    } catch (e) {
        console.error("Profil kaydetme hatasi:", e);
    }
}

async function savePrivateProfile(uid: string, email: string) {
    if (!email) return;
    try {
        await setDoc(doc(db, "user_private", uid), {
            email,
            updatedAt: new Date().toISOString(),
        }, { merge: true });
    } catch (e) {
        console.error("Özel profil kaydetme hatası:", e);
    }
}

async function syncServerSession(idToken?: string) {
    const response = await fetch('/api/auth/session', {
        method: idToken ? 'POST' : 'DELETE',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: idToken ? { 'Content-Type': 'application/json' } : undefined,
        body: idToken ? JSON.stringify({ idToken }) : undefined,
    });
    if (!response.ok) throw new Error(`Oturum eşitleme başarısız: ${response.status}`);
}

/* ── Turkce hata mesajlari ── */
function firebaseError(code: string): string {
    const map: Record<string, string> = {
        "auth/email-already-in-use": "Bu e-posta adresi zaten kayitli.",
        "auth/invalid-email": "Gecersiz e-posta adresi.",
        "auth/user-disabled": "Bu hesap devre disi birakilmis.",
        "auth/user-not-found": "Kullanici bulunamadi.",
        "auth/wrong-password": "Hatali sifre.",
        "auth/weak-password": "Sifre en az 6 karakter olmali.",
        "auth/too-many-requests": "Cok fazla deneme yaptiniz. Lutfen bekleyin.",
        "auth/popup-closed-by-user": "Google giris penceresi kapatildi.",
        "auth/network-request-failed": "Ag hatasi. Internet baglantinizi kontrol edin.",
        "auth/invalid-credential": "E-posta veya sifre hatali.",
    };
    return map[code] || "Bir hata olustu. Lutfen tekrar deneyin.";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);
    const router = useRouter();

    /* ── Auth state listener ── */
    useEffect(() => {
        const unsubscribe = onIdTokenChanged(auth, async (fbUser) => {
            if (fbUser) {
                const appUser = await mapFirebaseUser(fbUser);
                setFirebaseUser(fbUser);
                setUser(appUser);
                localStorage.setItem("Otosoz_user", JSON.stringify(appUser));

                // Token JavaScript tarafından okunabilen bir cookie'ye yazılmaz.
                // Sunucu tokenı doğrular ve HttpOnly oturum çerezlerini üretir.
                try {
                    await syncServerSession(await fbUser.getIdToken());
                } catch (e) {
                    console.warn('Sunucu oturumu eşitlenemedi:', e);
                }

                // Profil tamamlanmamissa flag'i ayarla
                if (!appUser.profileComplete) {
                    setNeedsProfileCompletion(true);
                } else {
                    setNeedsProfileCompletion(false);
                }
            } else {
                setFirebaseUser(null);
                setUser(null);
                setNeedsProfileCompletion(false);
                localStorage.removeItem("Otosoz_user");
                void syncServerSession().catch(() => {});
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    /* ── Email/Password Login ── */
    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsLoading(false);
            return true;
        } catch (err: unknown) {
            const code = (err as { code?: string }).code || "";
            setError(firebaseError(code));
            setIsLoading(false);
            return false;
        }
    };

    /* ── Google Login ── */
    const loginWithGoogle = async (): Promise<{ success: boolean; isNewUser: boolean }> => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const fbUser = result.user;

            // Firestore'da profil var mi kontrol et
            const snap = await getDoc(doc(db, "users", fbUser.uid));
            const isNewUser = !snap.exists() || !(snap.data()?.profileComplete);

            if (!snap.exists()) {
                // Temel bilgileri kaydet, profil tamamlanmadi olarak isaretle
                await saveProfile(fbUser.uid, {
                    googleDisplayName: fbUser.displayName || "",
                    googlePhotoURL: fbUser.photoURL || "",
                    role: "caylak",
                    level: "Cirak",
                    createdAt: new Date().toISOString(),
                    provider: "google",
                    profileComplete: false,
                });
                await savePrivateProfile(fbUser.uid, fbUser.email || "");
            }

            if (isNewUser) {
                setNeedsProfileCompletion(true);
            }

            setIsLoading(false);
            return { success: true, isNewUser };
        } catch (err: unknown) {
            const code = (err as { code?: string }).code || "";
            if (code !== "auth/popup-closed-by-user") {
                setError(firebaseError(code));
            }
            setIsLoading(false);
            return { success: false, isNewUser: false };
        }
    };

    /* ── Complete Profile (Google/Apple sonrasi) ── */
    const completeProfile = async (data: { firstName: string; lastName: string; username: string; city: string }): Promise<boolean> => {
        if (!firebaseUser) return false;
        setIsLoading(true);
        setError(null);
        try {
            // Önce username format doğrulaması
            const validation = validateUsername(data.username);
            if (!validation.isValid) {
                setError(validation.message);
                setIsLoading(false);
                return false;
            }

            // Sonra benzersizlik kontrolü
            const isAvailable = await checkUsernameAvailability(data.username);
            if (!isAvailable) {
                setError("Bu kullanıcı adı zaten alınmış. Lütfen başka bir kullanıcı adı seçin.");
                setIsLoading(false);
                return false;
            }

            const displayName = `${data.firstName} ${data.lastName}`.trim();
            await updateProfile(firebaseUser, { displayName });

            await saveProfile(firebaseUser.uid, {
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                displayName,
                city: data.city,
                profileComplete: true,
            });

            // User state'i guncelle
            const updatedUser = await mapFirebaseUser(firebaseUser);
            setUser(updatedUser);
            setNeedsProfileCompletion(false);
            localStorage.setItem("Otosoz_user", JSON.stringify(updatedUser));

            // Görev tetikle: profil tamamlandı
            try {
                const { markQuestComplete } = await import("@/lib/questService");
                await markQuestComplete(firebaseUser.uid, "profileCompleted");
            } catch { /* sessiz */ }

            setIsLoading(false);
            return true;
        } catch (err: unknown) {
            console.error("Profil tamamlama hatasi:", err);
            setError("Profil tamamlanirken bir hata olustu.");
            setIsLoading(false);
            return false;
        }
    };

    /* ── Kullanıcı adı benzersizlik kontrolü ── */
    const checkUsernameAvailability = async (username: string): Promise<boolean> => {
        try {
            const usernameQuery = query(
                collection(db, "users"),
                where("username", "==", username.trim().toLowerCase())
            );
            const snapshot = await getDocs(usernameQuery);
            // Eğer mevcut kullanıcının kendi username'i ise izin ver
            if (snapshot.size === 1 && firebaseUser) {
                const existingDoc = snapshot.docs[0];
                if (existingDoc.id === firebaseUser.uid) return true;
            }
            return snapshot.empty;
        } catch (e) {
            console.error("Username kontrol hatasi:", e);
            return false;
        }
    };

    /* ── Register ── */
    const register = async (email: string, password: string, username: string, city?: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            // Username'i normalize et (kontrol ile kayıt tutarlı olsun: hep küçük harf)
            const normalizedUsername = username.trim().toLowerCase();

            // Önce username format doğrulaması
            const validation = validateUsername(normalizedUsername);
            if (!validation.isValid) {
                setError(validation.message);
                setIsLoading(false);
                return false;
            }

            // Sonra benzersizlik kontrolü
            const isAvailable = await checkUsernameAvailability(normalizedUsername);
            if (!isAvailable) {
                setError("Bu kullanıcı adı zaten alınmış. Lütfen başka bir kullanıcı adı seçin.");
                setIsLoading(false);
                return false;
            }

            // Şifre güvenlik politikası (min 8 karakter, harf + rakam)
            const passCheck = validatePassword(password);
            if (!passCheck.valid) {
                setError(passCheck.error || 'Şifre güvenlik kurallarına uymuyor.');
                setIsLoading(false);
                return false;
            }

            const cred = await createUserWithEmailAndPassword(auth, email, password);
            const fbUser = cred.user;

            await updateProfile(fbUser, { displayName: normalizedUsername });

            await saveProfile(fbUser.uid, {
                username: normalizedUsername,
                displayName: normalizedUsername,
                role: "caylak",
                level: "Cirak",
                city: city || "",
                createdAt: new Date().toISOString(),
                provider: "email",
                profileComplete: true,
            });
            await savePrivateProfile(fbUser.uid, email);

            setIsLoading(false);
            return true;
        } catch (err: unknown) {
            const code = (err as { code?: string }).code || "";
            setError(firebaseError(code));
            setIsLoading(false);
            return false;
        }
    };

    /* ── Logout ── */
    const logout = () => {
        signOut(auth);
        setUser(null);
        setFirebaseUser(null);
        setNeedsProfileCompletion(false);
        localStorage.removeItem("Otosoz_user");
        void syncServerSession().catch(() => {});
        router.push("/");
    };

    /* ── Update Role ── */
    const updateRole = (role: UserRole) => {
        if (user) {
            const updatedUser = { ...user, role };
            setUser(updatedUser);
            localStorage.setItem("Otosoz_user", JSON.stringify(updatedUser));
        }
    };

    /* ── Get Firebase ID Token (API calls icin) ── */
    const getIdToken = async (): Promise<string | null> => {
        if (!firebaseUser) return null;
        try {
            return await firebaseUser.getIdToken(true);
        } catch {
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, firebaseUser, login, loginWithGoogle, register, completeProfile, checkUsernameAvailability, logout, updateRole, getIdToken, isLoading, error, needsProfileCompletion }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
