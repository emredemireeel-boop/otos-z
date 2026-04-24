"use client";

import { useState, useEffect } from "react";
import {
    subscribeToTerms, addTerm, updateTerm, deleteTerm,
    type DictionaryTerm
} from "@/lib/dictionaryService";
import {
    BookOpen, Plus, Edit3, Trash2, X, Save, Search,
    AlertTriangle, CheckCircle, ChevronRight, Info, Tag, Eye
} from "lucide-react";

const CATEGORIES = ["Mekanik", "Elektrik", "Lastik/Jant", "Sürüş", "Sıvılar", "Sigorta/Resmi", "Elektronik/OBD"];

const CATEGORY_COLORS: Record<string, string> = {
    'Mekanik': '#667EEA',
    'Elektrik': '#F093FB',
    'Lastik/Jant': '#4FACFE',
    'Sürüş': '#43E97B',
    'Sıvılar': '#FA709A',
    'Sigorta/Resmi': '#FF9A56',
    'Elektronik/OBD': '#7F7FD5',
};

export default function DictionaryManagementPage() {
    const [terms, setTerms] = useState<DictionaryTerm[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState("Tümü");
    const [showModal, setShowModal] = useState(false);
    const [editingTerm, setEditingTerm] = useState<DictionaryTerm | null>(null);
    const [selectedTerm, setSelectedTerm] = useState<DictionaryTerm | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [form, setForm] = useState({ term: "", description: "", why: "", category: "Mekanik", letter: "" });

    useEffect(() => {
        const unsub = subscribeToTerms(
            (data) => { setTerms(data); setLoading(false); setError(null); },
            (err) => { setError(err.message); setLoading(false); }
        );
        return () => unsub();
    }, []);

    useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);

    const filtered = terms.filter(t => {
        const matchSearch = !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
        const matchCat = filterCat === "Tümü" || t.category === filterCat;
        return matchSearch && matchCat;
    });

    const openNew = () => {
        setEditingTerm(null);
        setForm({ term: "", description: "", why: "", category: "Mekanik", letter: "" });
        setShowModal(true);
    };

    const openEdit = (t: DictionaryTerm) => {
        setEditingTerm(t);
        setForm({ term: t.term, description: t.description, why: t.why, category: t.category, letter: t.letter });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.term.trim() || !form.description.trim() || saving) return;
        setSaving(true);
        try {
            const letter = form.letter.trim() || form.term.charAt(0).toUpperCase();
            const data = { ...form, letter };
            if (editingTerm) {
                await updateTerm(editingTerm.id, data);
                setToast({ msg: `"${form.term}" güncellendi`, type: "success" });
                if (selectedTerm?.id === editingTerm.id) {
                    setSelectedTerm({ ...editingTerm, ...data });
                }
            } else {
                await addTerm(data);
                setToast({ msg: `"${form.term}" eklendi`, type: "success" });
            }
            setShowModal(false);
        } catch (e) {
            console.error(e);
            setToast({ msg: "Hata oluştu", type: "error" });
        }
        setSaving(false);
    };

    const handleDelete = async (id: string, termName: string) => {
        if (!confirm(`"${termName}" terimini silmek istediğinize emin misiniz?`)) return;
        setDeleting(id);
        try {
            await deleteTerm(id);
            setToast({ msg: `"${termName}" silindi`, type: "success" });
            if (selectedTerm?.id === id) setSelectedTerm(null);
        } catch (e) {
            setToast({ msg: "Silme hatası", type: "error" });
        }
        setDeleting(null);
    };

    const getCatColor = (cat: string) => CATEGORY_COLORS[cat] || '#6B7280';

    return (
        <div style={{ paddingBottom: '40px' }}>
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
                    padding: '14px 24px', borderRadius: '12px',
                    background: toast.type === 'success' ? 'rgba(16,185,129,0.95)' : 'rgba(239,68,68,0.95)',
                    color: 'white', fontSize: '14px', fontWeight: '600',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    animation: 'slideIn 0.3s ease',
                }}>
                    {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <BookOpen size={28} color="#8B5CF6" /> Sözlük Yönetimi
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        {terms.length} terim · Firestore üzerinden canlı yönetim
                    </p>
                </div>
                <button onClick={openNew} style={{
                    padding: '12px 24px', background: '#8B5CF6', color: 'white',
                    border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                    <Plus size={18} /> Yeni Terim
                </button>
            </div>

            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Terim ara..."
                        style={{ width: '100%', padding: '12px 16px 12px 40px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', fontSize: '14px', outline: 'none' }} />
                </div>
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                    style={{ padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', fontSize: '13px', outline: 'none' }}>
                    <option value="Tümü">Tüm Kategoriler</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                {CATEGORIES.map(cat => {
                    const count = terms.filter(t => t.category === cat).length;
                    const color = getCatColor(cat);
                    return (
                        <div key={cat} onClick={() => setFilterCat(filterCat === cat ? 'Tümü' : cat)} style={{
                            background: filterCat === cat ? `${color}15` : 'var(--card-bg)',
                            border: filterCat === cat ? `1px solid ${color}60` : '1px solid var(--card-border)',
                            borderRadius: '12px', padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                            <div style={{ fontSize: '20px', fontWeight: '800', color: filterCat === cat ? color : 'var(--foreground)' }}>{count}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{cat}</div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content: List + Detail */}
            <div style={{ display: 'grid', gridTemplateColumns: selectedTerm ? '1fr 400px' : '1fr', gap: '20px', alignItems: 'start' }}>
                {/* Terms List */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <div style={{ width: 40, height: 40, border: '3px solid var(--card-border)', borderTop: '3px solid #8B5CF6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Firestore verileri yükleniyor...</p>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '16px' }}>
                        <AlertTriangle size={40} style={{ color: '#EF4444', marginBottom: '12px' }} />
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#EF4444', marginBottom: '8px' }}>Firestore Bağlantı Hatası</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>{error}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Sözlük verilerini yüklemek için önce <strong>/admin/seed-dictionary</strong> sayfasından verileri aktarın.</p>
                    </div>
                ) : (
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>{filtered.length} sonuç</span>
                            {selectedTerm && (
                                <span style={{ fontSize: '12px', color: '#8B5CF6', fontWeight: '600' }}>Detay paneli açık</span>
                            )}
                        </div>
                        {filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                <BookOpen size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                                <p>Terim bulunamadı</p>
                            </div>
                        ) : (
                            <div>
                                {filtered.map((t, i) => {
                                    const isSelected = selectedTerm?.id === t.id;
                                    const catColor = getCatColor(t.category);
                                    return (
                                        <div key={t.id} onClick={() => setSelectedTerm(isSelected ? null : t)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '14px',
                                                padding: '14px 20px',
                                                borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                                cursor: 'pointer', transition: 'all 0.15s',
                                                background: isSelected ? 'rgba(139,92,246,0.08)' : 'transparent',
                                                borderLeft: isSelected ? '3px solid #8B5CF6' : '3px solid transparent',
                                            }}
                                            onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--secondary)'; }}
                                            onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '10px',
                                                background: `${catColor}18`, color: catColor,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '16px', fontWeight: '800', flexShrink: 0,
                                                border: `1px solid ${catColor}30`,
                                            }}>{t.letter}</div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '3px' }}>{t.term}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</div>
                                            </div>
                                            <span style={{
                                                fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px',
                                                background: `${catColor}15`, color: catColor, flexShrink: 0, border: `1px solid ${catColor}30`,
                                            }}>
                                                {t.category}
                                            </span>
                                            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                                <button onClick={(e) => { e.stopPropagation(); openEdit(t); }} style={{
                                                    width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--card-border)',
                                                    background: 'var(--secondary)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                }}><Edit3 size={14} /></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(t.id, t.term); }} disabled={deleting === t.id} style={{
                                                    width: '32px', height: '32px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)',
                                                    background: 'rgba(239,68,68,0.05)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                    opacity: deleting === t.id ? 0.5 : 1,
                                                }}><Trash2 size={14} /></button>
                                            </div>
                                            <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0, transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Detail Panel */}
                {selectedTerm && (
                    <div style={{
                        position: 'sticky', top: '96px',
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: '16px', overflow: 'hidden',
                    }}>
                        {/* Detail Header */}
                        <div style={{
                            padding: '20px', borderBottom: '1px solid var(--card-border)',
                            background: `linear-gradient(135deg, ${getCatColor(selectedTerm.category)}10, transparent)`,
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '14px',
                                    background: `${getCatColor(selectedTerm.category)}18`,
                                    border: `2px solid ${getCatColor(selectedTerm.category)}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '22px', fontWeight: '800', color: getCatColor(selectedTerm.category),
                                }}>{selectedTerm.letter}</div>
                                <button onClick={() => setSelectedTerm(null)} style={{
                                    background: 'var(--secondary)', border: '1px solid var(--card-border)',
                                    borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-muted)',
                                }}><X size={16} /></button>
                            </div>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '8px', lineHeight: 1.3 }}>
                                {selectedTerm.term}
                            </h2>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700',
                                background: `${getCatColor(selectedTerm.category)}15`,
                                color: getCatColor(selectedTerm.category),
                                border: `1px solid ${getCatColor(selectedTerm.category)}30`,
                            }}>
                                <Tag size={12} /> {selectedTerm.category}
                            </span>
                        </div>

                        {/* Detail Body */}
                        <div style={{ padding: '20px' }}>
                            {/* Açıklama */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                    <Info size={14} color="#3B82F6" />
                                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Açıklama</span>
                                </div>
                                <p style={{
                                    fontSize: '13px', color: 'var(--foreground)', lineHeight: 1.7,
                                    padding: '14px', background: 'var(--secondary)', borderRadius: '10px',
                                    border: '1px solid var(--border-subtle)',
                                }}>
                                    {selectedTerm.description}
                                </p>
                            </div>

                            {/* Neden Önemli */}
                            {selectedTerm.why && (
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                        <AlertTriangle size={14} color="#F59E0B" />
                                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Neden Önemli?</span>
                                    </div>
                                    <p style={{
                                        fontSize: '13px', color: 'var(--foreground)', lineHeight: 1.7,
                                        padding: '14px', background: 'rgba(245,158,11,0.06)', borderRadius: '10px',
                                        border: '1px solid rgba(245,158,11,0.15)',
                                    }}>
                                        {selectedTerm.why}
                                    </p>
                                </div>
                            )}

                            {/* Meta */}
                            <div style={{
                                padding: '12px 14px', background: 'var(--secondary)', borderRadius: '10px',
                                border: '1px solid var(--border-subtle)', marginBottom: '16px',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Harf</span>
                                    <span style={{ color: 'var(--foreground)', fontWeight: '700' }}>{selectedTerm.letter}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Kategori</span>
                                    <span style={{ color: getCatColor(selectedTerm.category), fontWeight: '700' }}>{selectedTerm.category}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Firestore ID</span>
                                    <span style={{ color: 'var(--foreground)', fontWeight: '500', fontSize: '10px', fontFamily: 'monospace' }}>{selectedTerm.id.slice(0, 12)}...</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => openEdit(selectedTerm)} style={{
                                    flex: 1, padding: '12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                                    borderRadius: '10px', color: '#3B82F6', fontWeight: '600', cursor: 'pointer', fontSize: '13px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                }}>
                                    <Edit3 size={14} /> Düzenle
                                </button>
                                <button onClick={() => handleDelete(selectedTerm.id, selectedTerm.term)} style={{
                                    flex: 1, padding: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
                                    borderRadius: '10px', color: '#EF4444', fontWeight: '600', cursor: 'pointer', fontSize: '13px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                }}>
                                    <Trash2 size={14} /> Sil
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}
                    onClick={() => setShowModal(false)}>
                    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '550px' }}
                        onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>
                                {editingTerm ? 'Terim Düzenle' : 'Yeni Terim Ekle'}
                            </h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        {[
                            { label: "Terim *", key: "term", placeholder: "Örn: ABS (Anti-lock Braking System)" },
                            { label: "Açıklama *", key: "description", placeholder: "Terimin detaylı açıklaması...", multiline: true },
                            { label: "Neden Önemli?", key: "why", placeholder: "Bu neden önemli...", multiline: true },
                            { label: "Harf", key: "letter", placeholder: "A (otomatik)" },
                        ].map(field => (
                            <div key={field.key} style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>{field.label}</label>
                                {(field as any).multiline ? (
                                    <textarea value={(form as any)[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder} rows={3}
                                        style={{ width: '100%', padding: '12px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', fontSize: '14px', outline: 'none', resize: 'none' }} />
                                ) : (
                                    <input type="text" value={(form as any)[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder}
                                        style={{ width: '100%', padding: '12px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', fontSize: '14px', outline: 'none' }} />
                                )}
                            </div>
                        ))}

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>Kategori</label>
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                style={{ width: '100%', padding: '12px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', fontSize: '14px', outline: 'none' }}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', background: 'var(--secondary)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', fontWeight: '500', cursor: 'pointer', fontSize: '14px' }}>İptal</button>
                            <button onClick={handleSave} disabled={!form.term.trim() || !form.description.trim() || saving} style={{
                                flex: 1, padding: '14px', background: (!form.term.trim() || !form.description.trim()) ? 'var(--secondary)' : '#8B5CF6',
                                border: 'none', borderRadius: '10px', color: 'white', fontWeight: '600', cursor: form.term.trim() && form.description.trim() ? 'pointer' : 'not-allowed',
                                opacity: form.term.trim() && form.description.trim() ? 1 : 0.5, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}>
                                {saving ? "Kaydediliyor..." : <><Save size={16} /> Kaydet</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
