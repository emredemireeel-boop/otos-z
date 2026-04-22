"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { createThread } from "@/lib/forumService";
import { ArrowLeftRight, Star, CheckCircle, Car, Type, FileText, Sparkles, ExternalLink, LogIn, AlertCircle, Plus, Minus, Link2 } from "lucide-react";
import Link from "next/link";

interface CompareItem {
    name: string;
    url: string;
}

const ALLOWED_DOMAINS = ['sahibinden.com', 'arabam.com'];

function isAllowedUrl(url: string): boolean {
    const trimmed = url.trim();
    if (!trimmed) return false;
    try {
        const normalized = (!trimmed.startsWith('http://') && !trimmed.startsWith('https://'))
            ? `https://${trimmed}` : trimmed;
        const hostname = new URL(normalized).hostname.toLowerCase();
        return ALLOWED_DOMAINS.some(d => hostname === d || hostname.endsWith(`.${d}`));
    } catch {
        return false;
    }
}

function normalizeUrl(url: string): string {
    const trimmed = url.trim();
    if (!trimmed) return '';
    return (!trimmed.startsWith('http://') && !trimmed.startsWith('https://'))
        ? `https://${trimmed}` : trimmed;
}

export default function NewComparisonPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [count, setCount] = useState(2);
    const [items, setItems] = useState<CompareItem[]>([
        { name: "", url: "" },
        { name: "", url: "" },
    ]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [publishing, setPublishing] = useState(false);

    const updateItemsCount = (newCount: number) => {
        if (newCount < 2 || newCount > 5) return;
        setCount(newCount);
        const newItems = [...items];
        while (newItems.length < newCount) newItems.push({ name: "", url: "" });
        while (newItems.length > newCount) newItems.pop();
        setItems(newItems);
    };

    const updateItem = (index: number, field: 'name' | 'url', value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const generateAutoTitle = (): string => {
        const names = items.map(item => item.name.trim()).filter(name => name.length > 0);
        if (names.length === 0) return "KARSILASTIRMA";
        return names.join(" VS ").toUpperCase();
    };

    // Tum araclar icin gecerli URL ve isim girilmis mi?
    const allItemsValid = items.every(item =>
        item.name.trim().length > 0 && isAllowedUrl(item.url)
    );

    const canPublish = allItemsValid && items.length >= 2;

    const handlePublish = async () => {
        if (!canPublish || !user || publishing) return;
        setPublishing(true);

        try {
            const finalTitle = title.trim() || generateAutoTitle();
            const vehicleTags = items.map(item => item.name.trim());
            const urlInfo = items.map(item =>
                `${item.name.trim()}: ${normalizeUrl(item.url)}`
            ).join("\n");
            const content = `${description.trim() ? description.trim() + "\n\n" : ""}Karsilastirilan Araclar:\n${urlInfo}`;

            const threadId = await createThread({
                title: finalTitle,
                category: "Karsilastirma",
                content,
                description: description.trim(),
                tags: vehicleTags,
                authorId: user.id as string,
                authorUsername: user.username,
            });

            router.push(`/karsilastirma/${threadId}`);
        } catch (e) {
            console.error("Karsilastirma olusturulamadi:", e);
            alert("Hata olustu, lutfen tekrar deneyin.");
        }
        setPublishing(false);
    };

    if (!user) {
        return (
            <div><Navbar />
                <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <LogIn size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                        <h2 style={{ color: 'var(--foreground)', marginBottom: '12px' }}>Giris Yapmaniz Gerekiyor</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Karsilastirma olusturmak icin giris yapin.</p>
                        <Link href="/giris"><button style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>Giris Yap</button></Link>
                    </div>
                </main><Footer />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <main style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '60px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
                    {/* Hero */}
                    <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', marginBottom: '32px', background: 'var(--primary)', padding: '1px' }}>
                        <div style={{ background: 'var(--card-bg)', borderRadius: '23px', padding: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ArrowLeftRight style={{ width: '36px', height: '36px', color: 'white' }} />
                                    </div>
                                    <div>
                                        <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--foreground)', margin: 0, marginBottom: '4px' }}>Yeni Karsilastirma</h1>
                                        <p style={{ fontSize: '16px', color: 'var(--text-muted)', margin: 0 }}>Araclari karsilastirin ve paylasin</p>
                                    </div>
                                </div>
                            </div>

                            {/* Uyari Mesaji */}
                            <div style={{
                                padding: '14px 18px',
                                background: 'rgba(59, 130, 246, 0.08)',
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }}>
                                <Link2 size={20} style={{ color: '#3b82f6', flexShrink: 0 }} />
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                                    Her arac icin <strong style={{ color: '#3b82f6' }}>sahibinden.com</strong> veya <strong style={{ color: '#3b82f6' }}>arabam.com</strong> linki zorunludur.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Count */}
                    <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid var(--card-border)' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <Car style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />
                                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>Arac Sayisi</h3>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                            {[2, 3, 4, 5].map(num => (
                                <button key={num} onClick={() => updateItemsCount(num)} style={{
                                    padding: '20px', background: count === num ? 'var(--primary)' : 'var(--secondary)',
                                    border: count === num ? '2px solid var(--primary)' : '1px solid var(--card-border)',
                                    borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                }}>
                                    <span style={{ fontSize: '28px', fontWeight: '800', color: count === num ? 'white' : 'var(--text-muted)' }}>{num}</span>
                                    {count === num && <CheckCircle style={{ fontSize: '16px', color: 'white' }} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Vehicle Inputs */}
                    {items.map((item, index) => {
                        const urlValid = item.url.trim() === '' ? null : isAllowedUrl(item.url);
                        return (
                            <div key={index} style={{
                                background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', marginBottom: '16px',
                                border: `1px solid ${urlValid === false ? 'rgba(239, 68, 68, 0.4)' : 'var(--card-border)'}`,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: 'white' }}>{index + 1}</div>
                                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--foreground)', margin: 0 }}>Arac {index + 1}</h4>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>Arac Adi *</label>
                                    <input type="text" value={item.name} onChange={(e) => updateItem(index, 'name', e.target.value)} placeholder={`Orn: Toyota Corolla ${new Date().getFullYear()}`}
                                        style={{ width: '100%', padding: '12px 16px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '14px', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                        Ilan Linki * <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--text-muted)' }}>(sahibinden.com veya arabam.com)</span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input type="text" value={item.url} onChange={(e) => updateItem(index, 'url', e.target.value)}
                                            placeholder="https://www.sahibinden.com/ilan/..."
                                            style={{
                                                width: '100%', padding: '12px 16px', paddingRight: '44px', background: 'var(--secondary)',
                                                border: `1px solid ${urlValid === false ? '#EF4444' : urlValid === true ? '#22c55e' : 'var(--card-border)'}`,
                                                borderRadius: '8px', color: 'var(--foreground)', fontSize: '14px', outline: 'none',
                                            }} />
                                        {item.url.trim() && (
                                            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                                                {urlValid ? (
                                                    <a href={normalizeUrl(item.url)} target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e', display: 'flex' }}>
                                                        <ExternalLink size={18} />
                                                    </a>
                                                ) : (
                                                    <AlertCircle size={18} style={{ color: '#EF4444' }} />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {urlValid === false && (
                                        <p style={{ fontSize: '11px', color: '#EF4444', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <AlertCircle size={12} /> Sadece sahibinden.com veya arabam.com linkleri kabul edilir
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Title */}
                    <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', marginBottom: '16px', border: '1px solid var(--card-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <Type style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>Baslik</h3>
                        </div>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={generateAutoTitle()}
                            style={{ width: '100%', padding: '12px 16px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '14px', marginBottom: '12px', outline: 'none' }} />
                        <button onClick={() => setTitle(generateAutoTitle())} style={{ width: '100%', padding: '12px', background: 'transparent', border: '2px solid var(--primary)', borderRadius: '8px', color: 'var(--primary)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Sparkles style={{ width: '18px', height: '18px' }} /> Otomatik Baslik Olustur
                        </button>
                    </div>

                    {/* Description */}
                    <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid var(--card-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <FileText style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>Aciklama</h3>
                        </div>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Karsilastirma hakkinda detaylar..."
                            rows={5} style={{ width: '100%', padding: '12px 16px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--foreground)', fontSize: '14px', resize: 'vertical', lineHeight: '1.6', outline: 'none' }} />
                    </div>

                    {/* Publish */}
                    <button onClick={handlePublish} disabled={!canPublish || publishing} style={{
                        width: '100%', padding: '20px', background: canPublish ? 'var(--primary)' : 'var(--secondary)',
                        border: 'none', borderRadius: '16px', color: canPublish ? 'white' : 'var(--text-muted)',
                        fontSize: '18px', fontWeight: '700', cursor: canPublish ? 'pointer' : 'not-allowed',
                        opacity: canPublish ? 1 : 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                    }}>
                        <Star style={{ fontSize: '24px' }} />
                        {publishing ? 'Yayimlaniyor...' : canPublish ? 'Karsilastirmayi Yayimla' : `Her Arac Icin Isim ve Gecerli Link Girin`}
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}
