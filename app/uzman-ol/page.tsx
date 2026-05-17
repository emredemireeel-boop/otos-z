"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, ShieldCheck, CheckCircle, FileText, Store, Wrench, Car, Shield, Send, Loader2, AlertCircle, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/* ── OtoAsfalt.v2'den birebir alınan meslek & belge yapısı ── */
const PROFESSION_OPTIONS = [
    {
        id: "dealer",
        title: "Galericiyim",
        icon: Store,
        desc: "Araç alım-satım işleriyle profesyonel olarak ilgileniyorum",
        verificationDocs: ["İşyeri Fotoğrafı", "Ticaret Sicil Belgesi", "Vergi Levhası"],
    },
    {
        id: "mechanic",
        title: "Usta / Tamirciyim",
        icon: Wrench,
        desc: "Araç tamiri ve bakımı konusunda uzmanlığım var",
        verificationDocs: ["Atölye Fotoğrafı", "Ustalık Belgesi", "İş Kartı"],
    },
    {
        id: "expert",
        title: "Ekspertizim",
        icon: Car,
        desc: "Araç ekspertizi yapma yetkisine sahibim",
        verificationDocs: ["Ekspertiz Sertifikası", "İşyeri Belgesi", "Kimlik"],
    },
    {
        id: "traffic",
        title: "Trafikçiyim",
        icon: Shield,
        desc: "Trafik ve araç mevzuatı konusunda uzmanlığım var",
        verificationDocs: ["Görev Belgesi", "Kimlik", "İş Kartı"],
    },
];

export default function UzmanOlPage() {
    const { user, isLoading } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [form, setForm] = useState({ fullName: "", phone: "", city: "", experience: "", businessName: "", businessAddress: "", message: "" });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => { setMounted(true); }, []);
    if (!mounted || isLoading) return <div style={{ minHeight: '100vh', background: 'var(--background)' }} />;

    const isAlreadyExpert = (user?.role as string) === "uzman" || (user?.role as string) === "admin" || (user?.role as string) === "moderator";
    const selectedProf = PROFESSION_OPTIONS.find(p => p.id === selectedId);

    const handleSubmit = () => {
        if (!selectedProf || !form.fullName.trim()) return;
        setSubmitting(true);
        const docsText = selectedProf.verificationDocs.map((d, i) => `  ${i + 1}. ${d}`).join("\n");
        const subject = encodeURIComponent("OtoSöz Uzman Başvurusu - " + selectedProf.title);
        const body = encodeURIComponent(
            `=== OTOSÖZ UZMAN BAŞVURUSU ===\n\n` +
            `Başvuru Alanı: ${selectedProf.title}\n` +
            `Ad Soyad: ${form.fullName}\n` +
            `Kullanıcı Adı: ${user?.username || "-"}\n` +
            `Şehir: ${form.city}\n` +
            `Deneyim: ${form.experience || "-"} yıl\n` +
            `İşyeri: ${form.businessName || "-"}\n` +
            `İşyeri Adresi: ${form.businessAddress || "-"}\n` +
            `Telefon: ${form.phone || "-"}\n\n` +
            `--- Ek Not ---\n${form.message || "-"}\n\n` +
            `=== EKLENMESİ GEREKEN BELGELER ===\n` +
            `Lütfen aşağıdaki belgeleri bu e-postaya ek (attachment) olarak ekleyiniz:\n\n` +
            `${docsText}\n\n` +
            `Not: Belgeleriniz incelendikten sonra 24-48 saat içinde sonuç bildirilecektir.\n`
        );
        window.open(`mailto:iletisim@otosoz.com?subject=${subject}&body=${body}`, "_self");
        setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1500);
    };

    /* ── Başarıyla gönderildi ── */
    if (submitted) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
                <Navbar />
                <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                    <div style={{ maxWidth: '460px', width: '100%', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '44px', textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <CheckCircle size={32} color="#22c55e" />
                        </div>
                        <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '10px' }}>Başvurunuz Alındı!</h1>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
                            Başvurunuz incelemeye alındı. Sonuç 24-48 saat içinde e-posta adresinize bildirilecektir.
                        </p>
                        <Link href="/" style={{ textDecoration: 'none' }}>
                            <button style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--foreground)', color: 'var(--background)', fontSize: '14px', fontWeight: '700', border: 'none', cursor: 'pointer' }}>
                                Ana Sayfaya Dön
                            </button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "12px 14px", borderRadius: "10px",
        border: "1px solid var(--card-border)", background: "var(--secondary)",
        color: "var(--foreground)", fontSize: "14px", outline: "none",
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
            <Navbar />
            <main style={{ flex: 1, padding: '40px 20px' }}>
                <div style={{ maxWidth: '640px', margin: '0 auto' }}>

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <Briefcase size={26} color="var(--background)" />
                        </div>
                        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px' }}>
                            {isAlreadyExpert ? 'Uzman Profilim' : 'Uzman Başvurusu'}
                        </h1>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            {isAlreadyExpert
                                ? 'Onaylı uzmanlık alanlarınız ve yeni alan başvurusu yapabilirsiniz.'
                                : 'Otomotiv sektöründeki uzmanlığını kanıtla, Onaylı Uzman ol.'}
                        </p>
                    </div>

                    {/* Zaten uzmansan — durum kartı */}
                    {isAlreadyExpert && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '16px 20px', borderRadius: '12px', marginBottom: '24px',
                            background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)',
                        }}>
                            <ShieldCheck size={22} color="#22c55e" />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: '#22c55e' }}>Uzman Statüsü Aktif</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ek uzmanlık alanı için aşağıdan başvuru yapabilirsiniz.</div>
                            </div>
                        </div>
                    )}

                    {/* ── Profesyonel Doğrulama Kartları ── */}
                    <div style={{
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: '16px', padding: '24px', marginBottom: '20px',
                    }}>
                        <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px' }}>Profesyonel Doğrulama</h2>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                            Aşağıdaki kategorilerden birini seçin. Her kategori farklı belgeler gerektirir.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {PROFESSION_OPTIONS.map(prof => {
                                const Icon = prof.icon;
                                const isSelected = selectedId === prof.id;
                                // Simüle: gerçek uygulamada Firestore'dan gelir
                                const isVerified = false;
                                return (
                                    <button key={prof.id} onClick={() => setSelectedId(isSelected ? null : prof.id)} style={{
                                        display: 'flex', alignItems: 'center', gap: '14px',
                                        padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                                        background: isVerified ? 'rgba(34,197,94,0.04)' : isSelected ? 'var(--secondary)' : 'transparent',
                                        border: isVerified ? '1px solid rgba(34,197,94,0.3)' : isSelected ? '2px solid var(--foreground)' : '1px solid var(--card-border)',
                                        textAlign: 'left', transition: 'all 0.15s', width: '100%',
                                    }}>
                                        <div style={{
                                            width: '42px', height: '42px', borderRadius: '10px',
                                            background: isVerified ? 'rgba(34,197,94,0.12)' : isSelected ? 'var(--foreground)' : 'var(--secondary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            <Icon size={20} color={isVerified ? '#22c55e' : isSelected ? 'var(--background)' : 'var(--text-muted)'} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '14px', fontWeight: '700', color: isVerified ? '#22c55e' : 'var(--foreground)' }}>
                                                {prof.title}
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{prof.desc}</div>
                                        </div>
                                        {isVerified ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                                <CheckCircle size={18} color="#22c55e" />
                                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#22c55e' }}>Onaylı</span>
                                            </div>
                                        ) : (
                                            <div style={{
                                                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                                                border: isSelected ? '6px solid var(--foreground)' : '2px solid var(--card-border)',
                                                transition: 'all 0.15s',
                                            }} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Seçilen alanın detayları — Belgeler + Form ── */}
                    {selectedId && selectedProf && (
                        <div style={{
                            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                            borderRadius: '16px', padding: '24px', marginBottom: '20px',
                            animation: 'fadeIn 0.2s ease',
                        }}>
                            {/* Gerekli Belgeler */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <FileText size={18} color="var(--foreground)" />
                                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>
                                    {selectedProf.title} — Gerekli Belgeler
                                </h3>
                            </div>
                            <div style={{ background: 'var(--secondary)', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
                                {selectedProf.verificationDocs.map((doc, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                                        <span style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0 }}>
                                            {i + 1}
                                        </span>
                                        {doc}
                                    </div>
                                ))}
                            </div>

                            {/* Kişisel Bilgi Formu */}
                            <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '12px' }}>Başvuru Bilgileri</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ad Soyad *</label>
                                    <input value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} placeholder="Adınız Soyadınız" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Telefon</label>
                                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="05XX XXX XX XX" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Şehir *</label>
                                    <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="İstanbul" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deneyim (Yıl)</label>
                                    <input value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} placeholder="5" type="number" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>İşyeri Adı</label>
                                    <input value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} placeholder="XYZ Oto Ekspertiz" style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>İşyeri Adresi</label>
                                    <input value={form.businessAddress} onChange={e => setForm({...form, businessAddress: e.target.value})} placeholder="Cadde / Sokak / İlçe" style={inputStyle} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ek Mesaj</label>
                                    <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Kendiniz hakkında eklemek istediğiniz bilgiler..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                                </div>
                            </div>

                            {/* Bilgi notu */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--card-border)', marginBottom: '16px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span>Gönder butonuna bastığınızda e-posta uygulamanız açılır. Yukarıdaki belgeleri e-postaya ekleyip gönderin. İnceleme 24-48 saat sürer.</span>
                            </div>

                            {/* Submit */}
                            <button onClick={handleSubmit} disabled={submitting || !form.fullName.trim() || !form.city.trim()} style={{
                                width: '100%', padding: '14px', borderRadius: '12px',
                                background: (form.fullName.trim() && form.city.trim()) ? 'var(--foreground)' : 'var(--secondary)',
                                color: (form.fullName.trim() && form.city.trim()) ? 'var(--background)' : 'var(--text-muted)',
                                border: 'none', fontSize: '14px', fontWeight: '700',
                                cursor: (form.fullName.trim() && form.city.trim()) ? 'pointer' : 'not-allowed',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                opacity: submitting ? 0.7 : 1,
                            }}>
                                {submitting
                                    ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Gönderiliyor...</>
                                    : <><Send size={16} /> Başvuruyu Gönder</>}
                            </button>
                        </div>
                    )}

                    {/* Alt bilgi */}
                    {!selectedId && (
                        <div style={{
                            padding: '16px 20px', borderRadius: '12px',
                            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                            fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6',
                        }}>
                            <strong style={{ color: 'var(--foreground)' }}>Uzman ne kazanır?</strong><br />
                            Onaylı Uzman rozeti, İşlerim paneli erişimi, toplulukta güvenilir profil, kullanıcılardan iş talebi alabilme ve öncelikli görünürlük.
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
