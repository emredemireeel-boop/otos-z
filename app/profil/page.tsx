"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Redirect /profil to /profil/[current-user-id]
export default function ProfilRedirect() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (user) {
                // Redirect to own profile
                router.push(`/profil/${user.username}`);
            } else {
                // Not logged in, redirect to login
                router.push("/giris");
            }
        }
    }, [user, isLoading, router]);

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-white">
            Yönlendiriliyor...
        </div>
    );
}
