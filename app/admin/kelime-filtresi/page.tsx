"use client";

import { useState } from "react";
import {
    Shield, Plus, Trash2, Search, X, AlertTriangle,
    Eye, EyeOff, Check, RefreshCw, Filter, Star,
    ChevronRight, Edit2, Save, ToggleLeft, ToggleRight
} from "lucide-react";

//  Tipler 
type FilterMode = "engelle" | "yildizla" | "uyar";
type WordCategory = "kufur" | "hakaret" | "spam" | "siyasi" | "nsfw" | "ozel";

interface BannedWord {
    id: string;
    word: string;
    mode: FilterMode;
    category: WordCategory;
    addedBy: string;
    addedAt: string;
    matchCount: number;
    active: boolean;
    regex: boolean;
    whitelist: string[]; // bu kelimeyi içerip de pass geçen baÃ„şlamlar
}

const INITIAL_WORDS: BannedWord[] = [
    { id: "w-001", word: "salak", mode: "yildizla", category: "hakaret", addedBy: "Admin", addedAt: "01.01.2026", matchCount: 142, active: true, regex: false, whitelist: [] },
    { id: "w-002", word: "idiot", mode: "yildizla", category: "hakaret", addedBy: "Admin", addedAt: "01.01.2026", matchCount: 87, active: true, regex: false, whitelist: [] },
    { id: "w-003", word: "spam-link\\.com", mode: "engelle", category: "spam", addedBy: "Admin", addedAt: "05.02.2026", matchCount: 23, active: true, regex: true, whitelist: [] },
    { id: "w-004", word: "satın al hemen", mode: "engelle", category: "spam", addedBy: "Admin", addedAt: "10.02.2026", matchCount: 55, active: true, regex: false, whitelist: [] },
    { id: "w-005", word: "aptal", mode: "yildizla", category: "hakaret", addedBy: "Moderatör1", addedAt: "15.02.2026", matchCount: 201, active: true, regex: false, whitelist: ["aptal soru yok"] },
    { id: "w-006", word: "gerizekalı", mode: "engelle", category: "kufur", addedBy: "Admin", addedAt: "20.02.2026", matchCount: 64, active: true, regex: false, whitelist: [] },
    { id: "w-007", word: "whatsapp.com\\/.*reklam", mode: "engelle", category: "spam", addedBy: "Admin", addedAt: "01.03.2026", matchCount: 12, active: true, regex: true, whitelist: [] },
    { id: "w-008", word: "bedava para", mode: "uyar", category: "spam", addedBy: "Admin", addedAt: "05.03.2026", matchCount: 38, active: true, regex: false, whitelist: [] },
    { id: "w-009", word: "mal", mode: "uyar", category: "hakaret", addedBy: "Moderatör2", addedAt: "10.03.2026", matchCount: 312, active: false, regex: false, whitelist: ["makine malı", "hammadde"] },
    { id: "w-010", word: "seni", mode: "yildizla", category: "ozel", addedBy: "Admin", addedAt: "15.03.2026", matchCount: 0, active: false, regex: false, whitelist: [] },
];

const CATEGORIES: { key: WordCategory | "hepsi"; label: string; color: string }[] = [
    { key: "hepsi", label: "Tümü", color: "#6B7280" },
    { key: "kufur", label: "Küfür", color: "#EF4444" },
    { key: "hakaret", label: "Hakaret", color: "#F59E0B" },
    { key: "spam", label: "Spam/Reklam", color: "#3B82F6" },
    { key: "siyasi", label: "Siyasi", color: "#8B5CF6" },
    { key: "nsfw", label: "NSFW", color: "#EC4899" },
    { key: "ozel", label: "Özel", color: "#6B7280" },
];

const MODE_STYLE: Record<FilterMode, { bg: string; color: string; label: string; icon: string }> = {
    engelle: { bg: "rgba(239,68,68,0.12)", color: "#EF4444", label: "Engelle", icon: "🛑«" },
    yildizla: { bg: "rgba(245,158,11,0.1)", color: "#F59E0B", label: "Yıldızla", icon: "★★★" },
    uyar: { bg: "rgba(59,130,246,0.1)", color: "#3B82F6", label: "Uyar", icon: "⚠️�" },
};

//  Test Simülatörü 
function TestSimulator({ words }: { words: BannedWord[] }) {
    const [text, setText] = useState("");
    const [result, setResult] = useState<{ clean: string; found: { word: string; mode: FilterMode }[] } | null>(null);

    const runTest = () => {
        const active = words.filter(w => w.active);
        const found: { word: string; mode: FilterMode }[] = [];
        let clean = text;
        active.forEach(w => {
            const pattern = w.regex ? new RegExp(w.word, "gi") : new RegExp(w.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi");
            if (pattern.test(text)) {
                // whitelist kontrolü
                const isWhitelisted = w.whitelist.some(wl => text.toLowerCase().includes(wl.toLowerCase()));
                if (!isWhitelisted) {
                    found.push({ word: w.word, mode: w.mode });
                    if (w.mode === "yildizla") clean = clean.replace(pattern, m => "★".repeat(m.length));
                    else if (w.mode === "engelle") clean = "[İÇERİK ENGELLENDİ]";
                }
            }
        });
        setResult({ clean, found });
    };

    return (
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "22px", marginTop: "20px" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "800", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "8px" }}>
                 Canlı Filtre Test Alanı
            </h3>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Test edilecek metni buraya yazın..." rows={3}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border-subtle)", background: "var(--background)", color: "var(--foreground)", fontSize: "13px", outline: "none", resize: "none", boxSizing: "border-box", marginBottom: "10px" }} />
            <button onClick={runTest} disabled={!text.trim()} style={{ padding: "9px 18px", borderRadius: "9px", background: "var(--primary)", border: "none", color: "white", fontSize: "13px", fontWeight: "700", cursor: "pointer", marginBottom: "14px" }}>
                Filtreyi Test Et
            </button>
            {result && (
                <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                    {result.found.length === 0 ? (
                        <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", color: "#10B981", fontSize: "13px", fontWeight: "600" }}>
                            ✓ Temiz —� Yasaklı kelime bulunamadı
                        </div>
                    ) : (
                        <>
                            <div style={{ padding: "12px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)" }}>
                                <p style={{ margin: "0 0 6px", fontSize: "12px", fontWeight: "700", color: "#EF4444" }}>⚠️� {result.found.length} eşleşme bulundu</p>
                                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                    {result.found.map((f, i) => (
                                        <span key={i} style={{ fontSize: "12px", fontWeight: "700", background: MODE_STYLE[f.mode].bg, color: MODE_STYLE[f.mode].color, padding: "2px 8px", borderRadius: "6px" }}>
                                            {MODE_STYLE[f.mode].icon} "{f.word}"
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ padding: "12px 16px", borderRadius: "10px", background: "var(--background)", border: "1px solid var(--border-subtle)" }}>
                                <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Filtrelenmiş Çıktı</p>
                                <p style={{ margin: 0, fontSize: "13px", color: "var(--foreground)", fontFamily: "monospace" }}>{result.clean}</p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default function AdminKelimeFiltresiPage() {
    const [words, setWords] = useState<BannedWord[]>(INITIAL_WORDS);
    const [catFilter, setCatFilter] = useState<WordCategory | "hepsi">("hepsi");
    const [search, setSearch] = useState("");
    const [showInactive, setShowInactive] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type?: string } | null>(null);

    // Yeni kelime form
    const [newWord, setNewWord] = useState("");
    const [newMode, setNewMode] = useState<FilterMode>("yildizla");
    const [newCat, setNewCat] = useState<WordCategory>("hakaret");
    const [newRegex, setNewRegex] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const showToast = (msg: string, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const addWord = () => {
        if (!newWord.trim()) return;
        const exists = words.some(w => w.word === newWord.trim());
        if (exists) { showToast("Bu kelime zaten listede!", "error"); return; }
        const w: BannedWord = {
            id: `w-${Date.now()}`, word: newWord.trim(), mode: newMode,
            category: newCat, addedBy: "Admin", addedAt: new Date().toLocaleDateString("tr-TR"),
            matchCount: 0, active: true, regex: newRegex, whitelist: [],
        };
        setWords(prev => [w, ...prev]);
        setNewWord(""); setNewRegex(false); setShowAdd(false);
        showToast(`✓ "${w.word}" filtre listesine eklendi.`);
    };

    const toggleWord = (id: string) => {
        setWords(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w));
    };

    const deleteWord = (id: string, word: string) => {
        setWords(prev => prev.filter(w => w.id !== id));
        showToast(`"${word}" listeden kaldırıldı.`, "error");
    };

    const changeModeFor = (id: string, mode: FilterMode) => {
        setWords(prev => prev.map(w => w.id === id ? { ...w, mode } : w));
        showToast("Filtre modu güncellendi.");
    };

    const filtered = words
        .filter(w => showInactive ? true : w.active)
        .filter(w => catFilter === "hepsi" || w.category === catFilter)
        .filter(w => !search || w.word.toLowerCase().includes(search.toLowerCase()));

    const totalMatches = words.filter(w => w.active).reduce((s, w) => s + w.matchCount, 0);

    return (
        <div style={{ position: "relative", paddingBottom: "40px" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--foreground)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <Shield size={24} color="#8B5CF6" /> Kelime Filtresi
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                        Yasaklı kelimeler · {words.filter(w => w.active).length} aktif kural · {totalMatches.toLocaleString("tr-TR")} toplam eşleşme
                    </p>
                </div>
                <button onClick={() => setShowAdd(v => !v)} style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--primary)", border: "none", color: "white", padding: "10px 18px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}>
                    <Plus size={15} /> Kelime Ekle
                </button>
            </div>

            {/* Yeni Kelime Formu */}
            {showAdd && (
                <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", padding: "20px", marginBottom: "20px", borderLeft: "4px solid var(--primary)" }}>
                    <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "800", color: "var(--foreground)" }}>Yeni Yasaklı Kelime / Kural</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div>
                            <label style={labelStyle}>Kelime / Pattern</label>
                            <input value={newWord} onChange={e => setNewWord(e.target.value)} placeholder='Örn: "aptal" veya regex: "reklam.+link"'
                                style={inputStyle} onKeyDown={e => e.key === "Enter" && addWord()} />
                        </div>
                        <div>
                            <label style={labelStyle}>Kategori</label>
                            <select value={newCat} onChange={e => setNewCat(e.target.value as WordCategory)} style={{ ...inputStyle, cursor: "pointer" }}>
                                {CATEGORIES.filter(c => c.key !== "hepsi").map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Aksiyon</label>
                            <select value={newMode} onChange={e => setNewMode(e.target.value as FilterMode)} style={{ ...inputStyle, cursor: "pointer" }}>
                                <option value="yildizla">★★★ Yıldızla</option>
                                <option value="engelle">🛑« Engelle</option>
                                <option value="uyar">⚠️� Uyar</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "14px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "var(--foreground)", fontWeight: "600" }}>
                            <input type="checkbox" checked={newRegex} onChange={e => setNewRegex(e.target.checked)} style={{ width: "15px", height: "15px" }} />
                            Regex Pattern (ileri düzey)
                        </label>
                        {newRegex && <span style={{ fontSize: "11px", color: "#F59E0B", background: "rgba(245,158,11,0.1)", padding: "3px 8px", borderRadius: "6px", fontWeight: "600" }}>⚠️� Regex aktif —� dikkatlice test edin</span>}
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => setShowAdd(false)} style={cancelBtnStyle}>İptal</button>
                        <button onClick={addWord} disabled={!newWord.trim()} style={{ flex: 2, padding: "11px", borderRadius: "10px", background: "var(--primary)", border: "none", color: "white", fontSize: "14px", fontWeight: "700", cursor: "pointer", opacity: newWord.trim() ? 1 : 0.4 }}>
                            Listeye Ekle
                        </button>
                    </div>
                </div>
            )}

            {/* Filtreler */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "4px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "4px" }}>
                    {CATEGORIES.map(c => {
                        const count = c.key === "hepsi" ? words.length : words.filter(w => w.category === c.key).length;
                        return (
                            <button key={c.key} onClick={() => setCatFilter(c.key)} style={{ padding: "6px 10px", borderRadius: "7px", border: "none", background: catFilter === c.key ? "var(--primary)" : "transparent", color: catFilter === c.key ? "white" : "var(--text-muted)", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
                                {c.label} <span style={{ fontSize: "10px", fontWeight: "800" }}>({count})</span>
                            </button>
                        );
                    })}
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", marginLeft: "4px" }}>
                    <input type="checkbox" checked={showInactive} onChange={e => setShowInactive(e.target.checked)} style={{ width: "13px", height: "13px" }} />
                    Pasif kuralları göster
                </label>

                <div style={{ display: "flex", alignItems: "center", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "10px", padding: "0 12px", height: "38px", width: "200px", gap: "7px", marginLeft: "auto" }}>
                    <Search size={13} style={{ color: "var(--text-muted)" }} />
                    <input type="text" placeholder="Kelime ara..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ border: "none", background: "transparent", outline: "none", width: "100%", color: "var(--foreground)", fontSize: "13px" }} />
                    {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={12} /></button>}
                </div>
            </div>

            {/* Tablo */}
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "14px", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 0.8fr 0.8fr 0.6fr", padding: "12px 20px", borderBottom: "1px solid var(--card-border)", background: "var(--background)" }}>
                    {["Kelime/Pattern", "Kategori", "Aksiyon", "Eşleşme", "Tarih", "Durum", "İŞlem"].map(h => (
                        <span key={h} style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                        <Shield size={32} style={{ margin: "0 auto 10px", display: "block", opacity: 0.3 }} />
                        <p style={{ margin: 0, fontWeight: "600" }}>Sonuç bulunamadı</p>
                    </div>
                ) : filtered.map((w, i) => {
                    const ms = MODE_STYLE[w.mode];
                    const cat = CATEGORIES.find(c => c.key === w.category);
                    return (
                        <div key={w.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 0.8fr 0.8fr 0.6fr", padding: "12px 20px", borderBottom: i !== filtered.length - 1 ? "1px solid var(--border-subtle)" : "none", alignItems: "center", opacity: w.active ? 1 : 0.55 }}>
                            <div style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: "700", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "8px" }}>
                                "{w.word}"
                                {w.regex && <span style={{ fontSize: "9px", background: "rgba(245,158,11,0.1)", color: "#F59E0B", padding: "1px 5px", borderRadius: "4px", fontWeight: "800" }}>REGEX</span>}
                                {w.whitelist.length > 0 && <span style={{ fontSize: "9px", background: "rgba(16,185,129,0.1)", color: "#10B981", padding: "1px 5px", borderRadius: "4px", fontWeight: "800" }}>+WL</span>}
                            </div>
                            <span style={{ fontSize: "11px", fontWeight: "700", background: `${cat?.color}18`, color: cat?.color, padding: "2px 8px", borderRadius: "6px", display: "inline-block" }}>{cat?.label}</span>
                            <div>
                                <select value={w.mode} onChange={e => changeModeFor(w.id, e.target.value as FilterMode)}
                                    style={{ fontSize: "11px", fontWeight: "700", background: ms.bg, color: ms.color, border: `1px solid ${ms.color}40`, borderRadius: "6px", padding: "3px 7px", cursor: "pointer", outline: "none" }}>
                                    <option value="yildizla">★★★ Yıldızla</option>
                                    <option value="engelle">🛑« Engelle</option>
                                    <option value="uyar">⚠️� Uyar</option>
                                </select>
                            </div>
                            <span style={{ fontSize: "13px", fontWeight: "800", color: w.matchCount > 100 ? "#EF4444" : "var(--foreground)" }}>
                                {w.matchCount.toLocaleString("tr-TR")}
                            </span>
                            <span style={{ fontSize: "11px", color: "var(--text-subtle)" }}>{w.addedAt}</span>
                            <button onClick={() => toggleWord(w.id)} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", padding: "5px 8px", borderRadius: "7px", fontSize: "11px", fontWeight: "700", color: w.active ? "#10B981" : "#6B7280" }}
                                onMouseEnter={e => e.currentTarget.style.background = "var(--background)"}
                                onMouseLeave={e => e.currentTarget.style.background = "none"}>
                                {w.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                {w.active ? "Aktif" : "Pasif"}
                            </button>
                            <button onClick={() => deleteWord(w.id, w.word)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", padding: "5px", borderRadius: "6px" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                                onMouseLeave={e => e.currentTarget.style.background = "none"}>
                                <Trash2 size={15} />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Test Alanı */}
            <TestSimulator words={words} />

            {toast && (
                <div style={{ position: "fixed", bottom: "32px", right: "32px", background: toast.type === "error" ? "#EF4444" : "#10B981", color: "white", padding: "14px 20px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.25)", fontWeight: "600", fontSize: "14px", zIndex: 9999, animation: "slideUp 0.3s ease" }}>
                    {toast.msg}
                </div>
            )}
            <style>{`@keyframes slideUp { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
        </div>
    );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: "9px", border: "1px solid var(--border-subtle)", background: "var(--background)", color: "var(--foreground)", fontSize: "13px", outline: "none", boxSizing: "border-box" };
const cancelBtnStyle: React.CSSProperties = { flex: 1, padding: "11px", borderRadius: "10px", background: "var(--background)", border: "1px solid var(--border-subtle)", color: "var(--foreground)", fontSize: "13px", fontWeight: "600", cursor: "pointer" };
