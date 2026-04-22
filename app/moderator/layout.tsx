"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import ModeratorSidebar from "@/components/moderator/ModeratorSidebar";
import { ShieldAlert, LogIn } from "lucide-react";

export default function ModeratorLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 48, height: 48, border: '3px solid var(--card-border)', borderTop: '3px solid #8B5CF6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px', padding: '40px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px' }}>
                    <LogIn size={32} color="#8B5CF6" style={{ marginBottom: '16px' }} />
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px' }}>Giris Gerekli</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Moderator paneline erismek icin giris yapin.</p>
                    <Link href="/giris"><button style={{ padding: '14px 32px', background: '#8B5CF6', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>Giris Yap</button></Link>
                </div>
            </div>
        );
    }

    if (user.role !== "moderator" && user.role !== "admin") {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px', padding: '40px', background: 'var(--card-bg)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '20px' }}>
                    <ShieldAlert size={32} color="#8B5CF6" style={{ marginBottom: '16px' }} />
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#8B5CF6', marginBottom: '12px' }}>Yetkisiz Erisim</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Bu alan sadece moderator ve admin icin erisime aciktir.</p>
                    <Link href="/"><button style={{ padding: '14px 32px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>Ana Sayfaya Don</button></Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--background)" }}>
            <ModeratorSidebar />
            <main style={{ flex: 1, overflowY: "auto" }}>
                <div style={{ padding: "28px 32px", maxWidth: "1100px" }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
