"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { Search, MapPin, Star, Award, Wrench, ChevronRight, X, Filter, ChevronDown, Plus, Phone, Clock, Save, Building2, Navigation, Map as MapIcon } from "lucide-react";
import { getCities, getDistrictsByCityCode } from "turkey-neighbourhoods";
import carModelsData from "@/data/carmodels.json";

const TurkeyMapSVG = dynamic(() => import("@/components/TurkeyMapSVG"), { ssr: false });
const RouteMap = dynamic(() => import("@/components/RouteMap"), { ssr: false });

interface Master {
    id: string; name: string; goldenKeys: number; specialty: string[];
    city: string; district: string; area: string; workshop: string;
    phone: string; experience: number; brands: string[];
    description: string; rating: number; reviewCount: number;
    address?: string; hours?: Record<string, string>; services?: string[];
    googleRating?: number; googleReviews?: number;
    lat?: number; lng?: number;
}

const ALL_BRANDS = Object.keys(carModelsData).sort();
const DAYS = ["pazartesi","sali","carsamba","persembe","cuma","cumartesi","pazar"];
const DAY_LABELS: Record<string, string> = { pazartesi:"Pazartesi", sali:"Salı", carsamba:"Çarşamba", persembe:"Perşembe", cuma:"Cuma", cumartesi:"Cumartesi", pazar:"Pazar" };

const CITY_MAP: Record<string, string> = {};
try { getCities().forEach(c => { CITY_MAP[c.code] = c.name; }); } catch {}

const SPECIALTIES = ["Tümü","Motor","Boya","Kaporta","Elektrik","Elektronik","Şanzıman","Mekatronik","Süspansiyon","Rot-Balans","Klima","Dizel Pompa","Enjektör","Fren","ABS","LPG","Turbo","Performans"];

const GoldenKey = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="url(#gk)" stroke="#B8860B" strokeWidth="1">
        <defs><linearGradient id="gk" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#FFD700"/><stop offset="100%" stopColor="#FFA000"/></linearGradient></defs>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const GoldenKeys = ({ count, size = 18 }: { count: number; size?: number }) => (
    <div style={{ display: "flex", gap: "2px" }}>
        {Array.from({ length: count }).map((_, i) => <GoldenKey key={i} size={size} />)}
        {Array.from({ length: 3 - count }).map((_, i) => (
            <svg key={`e${i}`} width={size} height={size} viewBox="0 0 24 24" fill="none" opacity={0.3}>
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ))}
    </div>
);

const getKeyLabel = (k: number) => k === 3 ? "Efsane Usta" : k === 2 ? "Uzman Usta" : "İyi Usta";
const getKeyColor = (k: number) => k === 3 ? "#FFD700" : k === 2 ? "#C0C0C0" : "#CD7F32";

export default function AltinAnahtarClient() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const [masters, setMasters] = useState<Master[]>([]);
    const [selectedPlate, setSelectedPlate] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("Tümü");
    const [showFilters, setShowFilters] = useState(false);
    const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
    const [expandedMaster, setExpandedMaster] = useState<string | null>(null);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: "", address: "", phone: "", city: "", district: "",
        area: "", description: "", goldenKeys: 1, experience: 5,
        rating: 4.5, reviewCount: 0, googleRating: 0, googleReviews: 0,
        specialtyList: [] as string[], brandList: [] as string[],
        servicesList: "",
        hours: { pazartesi:"08:30-18:30", sali:"08:30-18:30", carsamba:"08:30-18:30", persembe:"08:30-18:30", cuma:"08:30-18:30", cumartesi:"08:30-14:00", pazar:"Kapalı" } as Record<string, string>,
    });

    const handleSaveMaster = async () => {
        if (!form.name || !form.city || !form.phone) return alert("Firma adı, şehir ve telefon zorunlu!");
        setSaving(true);
        const newMaster: Master = {
            id: form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now(),
            name: form.name, workshop: form.name,
            goldenKeys: form.goldenKeys, specialty: form.specialtyList,
            city: form.city, district: form.district, area: form.area,
            address: form.address, phone: form.phone,
            experience: form.experience, brands: form.brandList,
            description: form.description,
            rating: form.rating, reviewCount: form.reviewCount,
            hours: form.hours, services: form.servicesList.split(",").map(s => s.trim()).filter(Boolean),
            googleRating: form.googleRating, googleReviews: form.googleReviews,
        };
        const updated = { masters: [...masters, newMaster] };
        try {
            await fetch("/api/admin", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "save_altin_anahtar", data: updated }),
            });
            // Ayrıca lokal olarak da güncelle
            setMasters([...masters, newMaster]);
            setShowAdminModal(false);
            setForm({ name:"", address:"", phone:"", city:"", district:"", area:"", description:"", goldenKeys:1, experience:5, rating:4.5, reviewCount:0, googleRating:0, googleReviews:0, specialtyList:[], brandList:[], servicesList:"", hours:{ pazartesi:"08:30-18:30", sali:"08:30-18:30", carsamba:"08:30-18:30", persembe:"08:30-18:30", cuma:"08:30-18:30", cumartesi:"08:30-14:00", pazar:"Kapalı" } });
            alert("Usta başarıyla eklendi!");
        } catch (e) { console.error(e); alert("Hata oluştu"); }
        setSaving(false);
    };

    useEffect(() => {
        fetch(`/data/altin_anahtar.json?t=${Date.now()}`)
            .then(r => r.json())
            .then(d => setMasters(d.masters || []))
            .catch(console.error);
    }, []);

    const selectedCityName = selectedPlate ? (CITY_MAP[selectedPlate] || null) : null;

    // İlçe listesi
    const districts = useMemo(() => {
        if (!selectedPlate) return [];
        try { return getDistrictsByCityCode(selectedPlate); } catch { return []; }
    }, [selectedPlate]);

    // Harita için master sayıları (plaka bazlı)
    const masterCountsByPlate = useMemo(() => {
        const counts: Record<string, number> = {};
        const plateToCity = Object.entries(CITY_MAP);
        masters.forEach(m => {
            const entry = plateToCity.find(([, name]) => name === m.city);
            if (entry) counts[entry[0]] = (counts[entry[0]] || 0) + 1;
        });
        return counts;
    }, [masters]);

    // Filtreleme
    const filtered = useMemo(() => {
        let list = masters;
        if (selectedCityName) list = list.filter(m => m.city === selectedCityName);
        if (selectedDistrict) list = list.filter(m => m.district === selectedDistrict);
        if (selectedSpecialty !== "Tümü") list = list.filter(m => m.specialty.includes(selectedSpecialty));
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(m =>
                m.name.toLowerCase().includes(q) || m.workshop.toLowerCase().includes(q) ||
                m.brands.some(b => b.toLowerCase().includes(q)) || m.city.toLowerCase().includes(q) ||
                m.specialty.some(s => s.toLowerCase().includes(q))
            );
        }
        return list.sort((a, b) => b.goldenKeys - a.goldenKeys || b.rating - a.rating);
    }, [masters, selectedCityName, selectedDistrict, selectedSpecialty, searchQuery]);

    const stats = useMemo(() => ({
        total: masters.length,
        legendary: masters.filter(m => m.goldenKeys === 3).length,
        cities: new Set(masters.map(m => m.city)).size,
    }), [masters]);

    const handleCityClick = (plate: string) => {
        if (selectedPlate === plate) {
            setSelectedPlate(null);
            setSelectedDistrict(null);
        } else {
            setSelectedPlate(plate);
            setSelectedDistrict(null);
        }
    };

    return (
        <div>
            <Navbar />
            <main style={{ minHeight: "100vh", background: "var(--background)" }}>
                {/* Hero */}
                <div style={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                    padding: "48px 24px 32px", position: "relative", overflow: "hidden"
                }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.05,
                        backgroundImage: "radial-gradient(circle at 25% 50%, #FFD700 0%, transparent 50%), radial-gradient(circle at 75% 50%, #FFA000 0%, transparent 50%)" }} />
                    <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                            <div style={{
                                width: "56px", height: "56px", borderRadius: "16px",
                                background: "linear-gradient(135deg, #FFD700, #FFA000)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 8px 32px rgba(255,215,0,0.3)"
                            }}>
                                <Award size={28} color="#1a1a2e" />
                            </div>
                            <div>
                                <h1 style={{ fontSize: "32px", fontWeight: "800", color: "white", margin: 0 }}>Altın Anahtar</h1>
                                <p style={{ fontSize: "14px", color: "rgba(255,215,0,0.8)", margin: 0, fontWeight: "600" }}>Türkiye&#39;nin İlk Yıldızlı Usta Rehberi</p>
                            </div>
                        </div>
                        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", maxWidth: "600px", lineHeight: "1.6", margin: "0 0 24px" }}>
                            Haritadan şehrinizi seçin, ilçe belirleyin ve derecelendirilmiş ustaları keşfedin.
                        </p>
                        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                            {[
                                { label: "Kayıtlı Usta", value: stats.total, icon: <Wrench size={16} color="#FFD700" /> },
                                { label: "Efsane Usta", value: stats.legendary, icon: <Award size={16} color="#FFD700" /> },
                                { label: "Şehir", value: stats.cities, icon: <MapPin size={16} color="#FFD700" /> },
                            ].map((s, i) => (
                                <div key={i} style={{
                                    display: "flex", alignItems: "center", gap: "10px",
                                    padding: "10px 18px", borderRadius: "12px",
                                    background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.15)"
                                }}>
                                    {s.icon}
                                    <div>
                                        <div style={{ fontSize: "20px", fontWeight: "800", color: "#FFD700" }}>{s.value}</div>
                                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
                    {/* Derecelendirme */}
                    <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap", padding: "16px 20px", borderRadius: "14px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                        {[
                            { keys: 3, label: "Efsane Usta", desc: "Türkiye çapında referans" },
                            { keys: 2, label: "Uzman Usta", desc: "Alanında uzmanlaşmış" },
                            { keys: 1, label: "İyi Usta", desc: "Güvenilir ve dürüst" },
                        ].map(item => (
                            <div key={item.keys} style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1", minWidth: "200px" }}>
                                <GoldenKeys count={item.keys} size={16} />
                                <div>
                                    <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--foreground)" }}>{item.label}</div>
                                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Harita */}
                    <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                                🗺️ Haritadan Şehir Seç
                            </h2>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                                {selectedCityName && (
                                    <span style={{ padding: "6px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", background: "#7c4dff18", color: "#7c4dff", border: "1px solid #7c4dff33" }}>
                                        📍 {selectedCityName}
                                    </span>
                                )}
                                {selectedDistrict && (
                                    <span style={{ padding: "6px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", background: "#4ade8018", color: "#4ade80", border: "1px solid #4ade8033" }}>
                                        🏘️ {selectedDistrict}
                                    </span>
                                )}
                                {(selectedPlate || selectedDistrict) && (
                                    <button onClick={() => { setSelectedPlate(null); setSelectedDistrict(null); }} style={{
                                        display: "flex", alignItems: "center", gap: "4px",
                                        padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "600",
                                        background: "#ef444418", color: "#ef4444", border: "1px solid #ef444433", cursor: "pointer"
                                    }}><X size={14} /> Temizle</button>
                                )}
                            </div>
                        </div>
                        <TurkeyMapSVG
                            onCityClick={(plate) => handleCityClick(plate)}
                            selectedPlate={selectedPlate}
                            masterCounts={masterCountsByPlate}
                        />

                    </div>

                    {/* İlçe Seçimi (Şehir seçiliyse) */}
                    {selectedPlate && districts.length > 0 && (
                        <div style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>
                                    🏘️ {selectedCityName} — İlçe Seç
                                </h3>
                                <button onClick={() => setShowDistrictDropdown(!showDistrictDropdown)} style={{
                                    display: "flex", alignItems: "center", gap: "4px", padding: "6px 14px",
                                    borderRadius: "8px", fontSize: "12px", fontWeight: "600",
                                    background: "var(--secondary)", color: "var(--foreground)",
                                    border: "1px solid var(--card-border)", cursor: "pointer"
                                }}>
                                    {showDistrictDropdown ? "Gizle" : `${districts.length} İlçe`} <ChevronDown size={14} style={{ transform: showDistrictDropdown ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                                </button>
                            </div>
                            {showDistrictDropdown && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", maxHeight: "200px", overflowY: "auto" }}>
                                    <button onClick={() => setSelectedDistrict(null)} style={{
                                        padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600",
                                        background: !selectedDistrict ? "var(--primary)" : "var(--secondary)",
                                        color: !selectedDistrict ? "white" : "var(--foreground)",
                                        border: `1px solid ${!selectedDistrict ? "var(--primary)" : "var(--card-border)"}`, cursor: "pointer"
                                    }}>Tüm İlçeler</button>
                                    {districts.map(d => (
                                        <button key={d} onClick={() => setSelectedDistrict(selectedDistrict === d ? null : d)} style={{
                                            padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600",
                                            background: selectedDistrict === d ? "var(--primary)" : "var(--secondary)",
                                            color: selectedDistrict === d ? "white" : "var(--foreground)",
                                            border: `1px solid ${selectedDistrict === d ? "var(--primary)" : "var(--card-border)"}`,
                                            cursor: "pointer", transition: "all 0.15s"
                                        }}>{d}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Arama + Filtre + Usta Kartları */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: "12px" }}>
                            <Search size={18} color="var(--text-muted)" />
                            <input type="text" placeholder="Usta, marka veya şehir ara..." value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--foreground)", fontSize: "14px" }} />
                            {searchQuery && <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex" }}><X size={16} /></button>}
                        </div>
                        <button onClick={() => setShowFilters(!showFilters)} style={{
                            display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderRadius: "12px", fontSize: "13px", fontWeight: "600",
                            background: showFilters ? "var(--primary)" : "var(--card-bg)",
                            color: showFilters ? "white" : "var(--foreground)",
                            border: `1px solid ${showFilters ? "var(--primary)" : "var(--card-border)"}`, cursor: "pointer"
                        }}><Filter size={16} /> Filtre</button>
                    </div>

                    {showFilters && (
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px", padding: "14px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                            {SPECIALTIES.map(s => (
                                <button key={s} onClick={() => setSelectedSpecialty(s)} style={{
                                    padding: "6px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600",
                                    background: selectedSpecialty === s ? "var(--primary)" : "var(--secondary)",
                                    color: selectedSpecialty === s ? "white" : "var(--foreground)",
                                    border: `1px solid ${selectedSpecialty === s ? "var(--primary)" : "var(--card-border)"}`, cursor: "pointer"
                                }}>{s}</button>
                            ))}
                        </div>
                    )}

                    <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
                        {selectedCityName && <><strong style={{ color: "#7c4dff" }}>{selectedCityName}</strong>{selectedDistrict && <> / <strong style={{ color: "#4ade80" }}>{selectedDistrict}</strong></>} — </>}
                        <strong style={{ color: "var(--foreground)" }}>{filtered.length}</strong> usta bulundu
                        {selectedSpecialty !== "Tümü" && <> · <strong>{selectedSpecialty}</strong></>}
                    </div>

                    {/* Usta Kartları */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {filtered.length === 0 && (
                            <div style={{ textAlign: "center", padding: "64px 24px", borderRadius: "16px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #FFD70015, #FFA00015)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                                    <Wrench size={36} color="#FFD700" style={{ opacity: 0.6 }} />
                                </div>
                                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--foreground)", marginBottom: "8px" }}>
                                    {selectedCityName ? `${selectedCityName} için henüz kayıtlı usta yok` : "Haritadan bir şehir seçin"}
                                </h3>
                                <p style={{ fontSize: "13px", color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto", lineHeight: "1.6" }}>
                                    {selectedCityName
                                        ? "Bu şehir için henüz Altın Anahtar derecelendirmesi yapılmamış. Yakında eklenecek!"
                                        : "Türkiye haritasından bir il seçerek o bölgedeki yıldızlı ustaları keşfedin."}
                                </p>
                            </div>
                        )}
                        {filtered.map(m => {
                            const isExpanded = expandedMaster === m.id;
                            return (
                            <div key={m.id} onClick={() => setExpandedMaster(isExpanded ? null : m.id)} style={{
                                background: "var(--card-bg)", border: "1px solid var(--card-border)",
                                borderRadius: "14px", padding: "16px", transition: "all 0.2s", cursor: "pointer",
                                borderLeft: `4px solid ${getKeyColor(m.goldenKeys)}`
                            }}>
                                {/* Header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                                            <h3 className="aa-card-title" style={{ fontSize: "16px", fontWeight: "700", color: "var(--foreground)", margin: 0 }}>{m.name}</h3>
                                            <span style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "700", background: `${getKeyColor(m.goldenKeys)}18`, color: getKeyColor(m.goldenKeys), whiteSpace: "nowrap" }}>{getKeyLabel(m.goldenKeys)}</span>
                                        </div>
                                        <GoldenKeys count={m.goldenKeys} size={14} />
                                    </div>
                                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                            <Star size={14} fill="#FFD700" color="#FFD700" />
                                            <span style={{ fontSize: "16px", fontWeight: "800", color: "var(--foreground)" }}>{m.rating}</span>
                                        </div>
                                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{m.reviewCount} yorum</span>
                                    </div>
                                </div>
                                {/* Açıklama */}
                                <p className="aa-desc" style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 8px", lineHeight: "1.5" }}>{m.description}</p>
                                {/* Adres */}
                                {m.address && (
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", padding: "8px 12px", background: "#7c4dff08", borderRadius: "8px", border: "1px solid #7c4dff18", marginBottom: "8px" }}>
                                        <Navigation size={13} color="#7c4dff" style={{ marginTop: "2px", flexShrink: 0 }} />
                                        <span style={{ fontSize: "12px", color: "var(--foreground)", fontWeight: "500", lineHeight: "1.4" }}>{m.address}</span>
                                    </div>
                                )}
                                {/* Etiketler */}
                                <div className="aa-tags" style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "8px" }}>
                                    {m.specialty.map(s => (
                                        <span key={s} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "600", background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--card-border)" }}>{s}</span>
                                    ))}
                                    {m.brands.slice(0, 3).map(b => (
                                        <span key={b} style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "600", background: "#7c4dff10", color: "#7c4dff", border: "1px solid #7c4dff22" }}>{b}</span>
                                    ))}
                                </div>
                                {/* Alt bilgi satırı */}
                                <div className="aa-meta" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                                    <div className="aa-meta-left" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "var(--text-muted)", flexWrap: "wrap" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={12} /> {m.district}, {m.city}</span>
                                        <span>{m.experience} yıl</span>
                                        {m.phone && <a href={`tel:${m.phone.replace(/[^0-9+]/g,'')}`} onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: "4px", color: "#2563EB", textDecoration: "none", fontWeight: "600" }}><Phone size={12} /> {m.phone}</a>}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--primary)", fontWeight: "600" }}>
                                        {isExpanded ? "Kapat" : "Detay"} <ChevronDown size={14} style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                                    </div>
                                </div>
                                {/* Genişletilmiş alan */}
                                {isExpanded && (
                                    <div style={{ marginTop: "12px", borderTop: "1px solid var(--card-border)", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                        {/* Çalışma Saatleri */}
                                        {m.hours && (
                                            <div style={{ padding: "10px 12px", background: "var(--secondary)", borderRadius: "8px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                                                    <Clock size={13} color="#FFD700" />
                                                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--foreground)" }}>Çalışma Saatleri</span>
                                                </div>
                                                <div className="aa-hours" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                                                    {Object.entries(m.hours).map(([d, h]) => (
                                                        <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                                                            <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)" }}>{DAY_LABELS[d] || d}</span>
                                                            <span style={{ fontSize: "11px", fontWeight: "700", color: h === "Kapalı" ? "#ef4444" : "var(--foreground)" }}>{h}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {/* Harita */}
                                        {m.lat && m.lng && (
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                                                    <MapIcon size={13} color="#FFD700" />
                                                    <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--foreground)" }}>Konum</span>
                                                </div>
                                                <div onClick={e => e.stopPropagation()}>
                                                    <RouteMap from={[m.lat, m.lng]} to={[m.lat, m.lng]} />
                                                </div>
                                                <a href={`https://www.google.com/maps?q=${m.lat},${m.lng}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                                                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "8px", padding: "8px 16px", borderRadius: "8px", background: "#2563EB", color: "white", fontSize: "12px", fontWeight: "700", textDecoration: "none" }}>
                                                    <Navigation size={14} /> Google Maps'te Aç
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            );
                        })}
                    </div>
                </div>

                {/* Admin Floating Button */}
                {isAdmin && (
                    <button onClick={() => setShowAdminModal(true)} style={{
                        position: "fixed", bottom: "32px", right: "32px", width: "56px", height: "56px",
                        borderRadius: "16px", background: "linear-gradient(135deg, #FFD700, #FFA000)",
                        border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 8px 32px rgba(255,215,0,0.4)", zIndex: 100, transition: "transform 0.2s"
                    }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                       onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                        <Plus size={24} color="#1a1a2e" strokeWidth={3} />
                    </button>
                )}

                {/* Admin Modal */}
                {isAdmin && showAdminModal && (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
                        onClick={e => { if (e.target === e.currentTarget) setShowAdminModal(false); }}>
                        <div style={{ background: "var(--card-bg)", borderRadius: "20px", width: "100%", maxWidth: "680px", maxHeight: "90vh", overflow: "auto", border: "1px solid var(--card-border)" }}>
                            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "var(--card-bg)", zIndex: 2, borderRadius: "20px 20px 0 0" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <Building2 size={20} color="#FFD700" />
                                    <h2 style={{ fontSize: "18px", fontWeight: "800", color: "var(--foreground)", margin: 0 }}>Usta / Servis Ekle</h2>
                                </div>
                                <button onClick={() => setShowAdminModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={20} /></button>
                            </div>
                            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                                {/* Firma Adı */}
                                <div>
                                    <label style={lbl}>Firma / Usta Adı *</label>
                                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Özkan Oto Servis" style={inp} />
                                </div>
                                {/* Adres */}
                                <div>
                                    <label style={lbl}>Detaylı Adres *</label>
                                    <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Ata Sanayi Sitesi, 8780/34. Sk. No:27" style={inp} />
                                </div>
                                {/* İl / İlçe / Semt */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                                    <div>
                                        <label style={lbl}>İl *</label>
                                        <select value={form.city} onChange={e => setForm({...form, city: e.target.value, district: ""})} style={inp}>
                                            <option value="">Seçin</option>
                                            {Object.values(CITY_MAP).sort().map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={lbl}>İlçe</label>
                                        <input value={form.district} onChange={e => setForm({...form, district: e.target.value})} placeholder="Çiğli" style={inp} />
                                    </div>
                                    <div>
                                        <label style={lbl}>Semt / Bölge</label>
                                        <input value={form.area} onChange={e => setForm({...form, area: e.target.value})} placeholder="Ata Sanayi" style={inp} />
                                    </div>
                                </div>
                                {/* Telefon */}
                                <div>
                                    <label style={lbl}>Telefon Numarası *</label>
                                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="(0232) 376 81 93" style={inp} />
                                </div>
                                {/* Çalışma Saatleri */}
                                <div>
                                    <label style={lbl}>Çalışma Saatleri</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                                        {DAYS.map(d => (
                                            <div key={d} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", width: "55px" }}>{DAY_LABELS[d]}</span>
                                                <input value={form.hours[d]} onChange={e => setForm({...form, hours: {...form.hours, [d]: e.target.value}})} style={{...inp, padding: "6px 10px", fontSize: "12px"}} placeholder="08:30-18:30" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Altın Anahtar Seviyesi */}
                                <div>
                                    <label style={lbl}>Altın Anahtar Seviyesi</label>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        {[1,2,3].map(k => (
                                            <button key={k} onClick={() => setForm({...form, goldenKeys: k})} style={{
                                                flex: 1, padding: "10px", borderRadius: "10px", cursor: "pointer", textAlign: "center",
                                                border: `2px solid ${form.goldenKeys === k ? "#FFD700" : "var(--card-border)"}`,
                                                background: form.goldenKeys === k ? "#FFD70015" : "var(--secondary)",
                                            }}>
                                                <GoldenKeys count={k} size={14} />
                                                <div style={{ fontSize: "11px", fontWeight: "600", color: "var(--foreground)", marginTop: "4px" }}>{getKeyLabel(k)}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Uzmanlık Alanları */}
                                <div>
                                    <label style={lbl}>Uzmanlık Alanları</label>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                        {SPECIALTIES.filter(s => s !== "Tümü").map(s => (
                                            <button key={s} onClick={() => {
                                                const list = form.specialtyList.includes(s) ? form.specialtyList.filter(x => x !== s) : [...form.specialtyList, s];
                                                setForm({...form, specialtyList: list});
                                            }} style={{
                                                padding: "5px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "600", cursor: "pointer",
                                                background: form.specialtyList.includes(s) ? "#FFD70020" : "var(--secondary)",
                                                color: form.specialtyList.includes(s) ? "#FFD700" : "var(--foreground)",
                                                border: `1px solid ${form.specialtyList.includes(s) ? "#FFD70055" : "var(--card-border)"}`,
                                            }}>{s}</button>
                                        ))}
                                    </div>
                                </div>
                                {/* Marka Seçimi */}
                                <div>
                                    <label style={lbl}>Uzman Olduğu Marka(lar)</label>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", maxHeight: "140px", overflowY: "auto", padding: "8px", background: "var(--secondary)", borderRadius: "10px" }}>
                                        {ALL_BRANDS.map(b => (
                                            <button key={b} onClick={() => {
                                                const list = form.brandList.includes(b) ? form.brandList.filter(x => x !== b) : [...form.brandList, b];
                                                setForm({...form, brandList: list});
                                            }} style={{
                                                padding: "4px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: "600", cursor: "pointer",
                                                background: form.brandList.includes(b) ? "#7c4dff20" : "var(--card-bg)",
                                                color: form.brandList.includes(b) ? "#7c4dff" : "var(--text-muted)",
                                                border: `1px solid ${form.brandList.includes(b) ? "#7c4dff44" : "var(--card-border)"}`,
                                            }}>{b}</button>
                                        ))}
                                    </div>
                                    {form.brandList.length > 0 && <div style={{ fontSize: "11px", color: "#7c4dff", marginTop: "6px" }}>Seçili: {form.brandList.join(", ")}</div>}
                                </div>
                                {/* Hizmetler */}
                                <div>
                                    <label style={lbl}>Hizmetler (virgülle ayırın)</label>
                                    <input value={form.servicesList} onChange={e => setForm({...form, servicesList: e.target.value})} placeholder="Motor arıza tespiti, Fren tamiri, Elektrik" style={inp} />
                                </div>
                                {/* Deneyim + Google Puan */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px" }}>
                                    <div><label style={lbl}>Deneyim (yıl)</label><input type="number" value={form.experience} onChange={e => setForm({...form, experience: +e.target.value})} style={inp} /></div>
                                    <div><label style={lbl}>Google Puan</label><input type="number" step="0.1" value={form.googleRating} onChange={e => setForm({...form, googleRating: +e.target.value, rating: +e.target.value})} style={inp} /></div>
                                    <div><label style={lbl}>Google Yorum</label><input type="number" value={form.googleReviews} onChange={e => setForm({...form, googleReviews: +e.target.value, reviewCount: +e.target.value})} style={inp} /></div>
                                    <div><label style={lbl}>Puan (0-5)</label><input type="number" step="0.1" max={5} value={form.rating} onChange={e => setForm({...form, rating: +e.target.value})} style={inp} /></div>
                                </div>
                                {/* Açıklama */}
                                <div>
                                    <label style={lbl}>Açıklama</label>
                                    <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Kısa tanıtım yazısı..." rows={3}
                                        style={{...inp, resize: "vertical", fontFamily: "inherit"}} />
                                </div>
                                {/* Kaydet */}
                                <button onClick={handleSaveMaster} disabled={saving} style={{
                                    padding: "14px", borderRadius: "12px", border: "none", cursor: saving ? "not-allowed" : "pointer",
                                    background: "linear-gradient(135deg, #FFD700, #FFA000)", color: "#1a1a2e",
                                    fontSize: "15px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                    opacity: saving ? 0.6 : 1
                                }}>
                                    <Save size={18} /> {saving ? "Kaydediliyor..." : "Kaydet"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
                    @media (max-width: 768px) {
                        .altin-grid { grid-template-columns: 1fr !important; }
                        .aa-card-title { font-size: 14px !important; }
                        .aa-desc { font-size: 12px !important; }
                        .aa-tags span { font-size: 9px !important; padding: 2px 6px !important; }
                        .aa-meta { flex-direction: column !important; align-items: flex-start !important; }
                        .aa-meta-left { flex-direction: column !important; gap: 4px !important; }
                        .aa-hours { grid-template-columns: 1fr !important; }
                    }
                `}</style>
            </main>
            <Footer />
        </div>
    );
}

const lbl: React.CSSProperties = { fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px", display: "block" };
const inp: React.CSSProperties = { width: "100%", padding: "10px 14px", background: "var(--secondary)", border: "1px solid var(--card-border)", borderRadius: "10px", color: "var(--foreground)", fontSize: "13px", outline: "none", boxSizing: "border-box" };
