"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { ShieldAlert, LogIn, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    // Loading state
    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, border: '3px solid var(--card-border)', borderTop: '3px solid #EF4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Yetki kontrol ediliyor...</p>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Not logged in
    if (!user) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px', padding: '40px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <LogIn size={32} color="#EF4444" />
                    </div>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px' }}>Giris Gerekli</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                        Admin paneline erismek icin giris yapmaniz gerekiyor.
                    </p>
                    <Link href="/giris">
                        <button style={{ padding: '14px 32px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <LogIn size={18} /> Giris Yap
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    // Not admin role
    if (user.role !== "admin") {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '400px', padding: '40px', background: 'var(--card-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <ShieldAlert size={32} color="#EF4444" />
                    </div>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#EF4444', marginBottom: '12px' }}>Yetkisiz Erisim</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                        Bu sayfaya erisim yetkiniz bulunmamaktadir. Sadece admin rolu olan kullanicilar erisebilir.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link href="/">
                            <button style={{ padding: '14px 32px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', width: '100%' }}>
                                Ana Sayfaya Don
                            </button>
                        </Link>
                        {process.env.NODE_ENV === "development" && (
                            <button 
                                onClick={async () => {
                                    try {
                                        const { doc, updateDoc } = await import("firebase/firestore");
                                        const { db } = await import("@/lib/firebase");
                                        await updateDoc(doc(db, "users", user.id.toString()), { role: "admin", level: "Yönetici" });
                                        window.location.reload();
                                    } catch (e) {
                                        alert("Hata: " + e);
                                    }
                                }}
                                style={{ padding: '14px 32px', background: 'transparent', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', width: '100%' }}
                            >
                                [Geliştirici] Hesabımı Admin Yap
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Admin — show panel
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
            <AdminSidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <AdminTopbar />
                <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
