"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

export type UserRole = "cirak" | "usta" | "standard" | "corporate" | "luxury" | "admin" | "moderator";

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
}

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    login: (email: string, password: string) => Promise<boolean>;
    loginWithGoogle: () => Promise<{ success: boolean; isNewUser: boolean }>;
    register: (email: string, password: string, username: string, city?: string) => Promise<boolean>;
    completeProfile: (data: { firstName: string; lastName: string; username: string; city: string }) => Promise<boolean>;
    logout: () => void;
    updateRole: (role: UserRole) => void;
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
        avatar: fbUser.photoURL || null,
        level: (profile.level as string) || "Yeni Uye",
        notifications: 0,
        role: (profile.role as UserRole) || "cirak",
        isAdmin: (profile.role as string) === "admin",
        isModerator: (profile.role as string) === "moderator",
        city: (profile.city as string) || undefined,
        firstName: (profile.firstName as string) || undefined,
        lastName: (profile.lastName as string) || undefined,
        profileComplete,
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
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                const appUser = await mapFirebaseUser(fbUser);
                setFirebaseUser(fbUser);
                setUser(appUser);
                localStorage.setItem("Otosoz_user", JSON.stringify(appUser));

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
                    email: fbUser.email || "",
                    googleDisplayName: fbUser.displayName || "",
                    googlePhotoURL: fbUser.photoURL || "",
                    role: "cirak",
                    level: "Cirak",
                    createdAt: new Date().toISOString(),
                    provider: "google",
                    profileComplete: false,
                });
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

            setIsLoading(false);
            return true;
        } catch (err: unknown) {
            console.error("Profil tamamlama hatasi:", err);
            setError("Profil tamamlanirken bir hata olustu.");
            setIsLoading(false);
            return false;
        }
    };

    /* ── Register ── */
    const register = async (email: string, password: string, username: string, city?: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            const fbUser = cred.user;

            await updateProfile(fbUser, { displayName: username });

            await saveProfile(fbUser.uid, {
                username,
                displayName: username,
                email,
                role: "cirak",
                level: "Cirak",
                city: city || "",
                createdAt: new Date().toISOString(),
                provider: "email",
                profileComplete: true,
            });

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
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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

    return (
        <AuthContext.Provider value={{ user, firebaseUser, login, loginWithGoogle, register, completeProfile, logout, updateRole, isLoading, error, needsProfileCompletion }}>
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
