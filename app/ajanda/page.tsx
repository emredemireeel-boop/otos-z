"use client";

import { useState, useEffect } from "react";
import {
    Car, ShieldCheck, FileCheck, Receipt, Wrench, Droplet, Filter, Wind, Fuel,
    Sparkles, Zap, Settings as SettingsIcon, Leaf, Gauge, RefreshCw, Thermometer, Battery,
    CheckCircle, Calendar, CalendarDays, Edit2, Check, Bell, RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// --- Types ---

type FuelType = "Benzin" | "Dizel" | "Elektrik";

interface MaintenanceItem {
    enabled: boolean;
    date: Date;
    notify: boolean;
}

// --- Helper Functions ---

const addMonths = (date: Date, months: number): Date => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
};

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatDateInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const calculateAutoDateAndText = (partLifeKm: number, userAnnualKm: number): { date: Date, text: string } => {
    const safeUserKm = userAnnualKm < 1000 ? 1000 : userAnnualKm;
    const yearsFloat = partLifeKm / safeUserKm;
    const totalMonths = Math.round(yearsFloat * 12);

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    let timeString = "";
    if (years > 0) timeString += `${years} Yıl `;
    if (months > 0) timeString += `${months} Ay`;
    if (years === 0 && months === 0) timeString = "1 Ay";

    const calculatedDate = addMonths(new Date(), Math.max(1, totalMonths));
    return {
        date: calculatedDate,
        text: `${partLifeKm.toLocaleString()} km • ${timeString}`
    };
};

export default function AgendaPage() {
    const { theme } = useTheme();

    // User Inputs
    const [annualKmInput, setAnnualKmInput] = useState("15000");
    const [selectedFuelType, setSelectedFuelType] = useState<FuelType>("Benzin");
    const [activeAnnualKm, setActiveAnnualKm] = useState(15000);
    const [activeFuelType, setActiveFuelType] = useState<FuelType>("Benzin");

    // UI States
    const [showSuccess, setShowSuccess] = useState(false);

    // Maintenance States
    const [items, setItems] = useState<Record<string, MaintenanceItem>>({});

    // Initialize dates on mount and when active parameters change
    useEffect(() => {
        const newItems: Record<string, MaintenanceItem> = {};

        const setItem = (key: string, lifeKm: number, defaultEnabled: boolean = true) => {
            const { date } = calculateAutoDateAndText(lifeKm, activeAnnualKm);
            newItems[key] = {
                enabled: items[key]?.enabled ?? defaultEnabled,
                date: items[key]?.date ?? date,
                notify: items[key]?.notify ?? true
            };
        };

        // Official
        newItems["inspection"] = {
            enabled: items["inspection"]?.enabled ?? true,
            date: items["inspection"]?.date ?? addMonths(new Date(), 24),
            notify: items["inspection"]?.notify ?? true
        };
        newItems["insurance"] = {
            enabled: items["insurance"]?.enabled ?? true,
            date: items["insurance"]?.date ?? addMonths(new Date(), 12),
            notify: items["insurance"]?.notify ?? true
        };
        newItems["mtv"] = {
            enabled: items["mtv"]?.enabled ?? true,
            date: items["mtv"]?.date ?? addMonths(new Date(), 6),
            notify: items["mtv"]?.notify ?? true
        };
        newItems["kasko"] = {
            enabled: items["kasko"]?.enabled ?? true,
            date: items["kasko"]?.date ?? addMonths(new Date(), 12),
            notify: items["kasko"]?.notify ?? true
        };

        // Maintenance
        setItem("maintenance", 15000);

        if (activeFuelType !== "Elektrik") {
            setItem("oilChange", 15000);
            setItem("oilFilter", 15000);
            setItem("airFilter", 20000);
            setItem("trigerBelt", 90000);
        }

        setItem("polenFilter", 15000);

        if (activeFuelType === "Dizel") {
            setItem("fuelFilter", 30000);
            setItem("dpf", 120000);
        } else if (activeFuelType === "Benzin") {
            setItem("fuelFilter", 60000);
            setItem("sparkPlugs", 50000);
        }

        setItem("brakePads", 45000);
        setItem("brakeFluid", 40000);

        const transKm = activeFuelType === "Elektrik" ? 80000 : 60000;
        setItem("transmissionFluid", transKm);

        setItem("tireRotation", 10000);
        setItem("coolant", 45000);

        newItems["battery"] = {
            enabled: items["battery"]?.enabled ?? true,
            date: items["battery"]?.date ?? addMonths(new Date(), 48),
            notify: items["battery"]?.notify ?? true
        };

        setItems(newItems);
    }, [activeAnnualKm, activeFuelType]);

    const handleCalculate = () => {
        const rawKm = parseInt(annualKmInput.replace(/\./g, '')) || 15000;
        const clampedKm = Math.min(Math.max(rawKm, 1000), 100000);
        setAnnualKmInput(clampedKm.toString());
        setActiveAnnualKm(clampedKm);
        setActiveFuelType(selectedFuelType);
        handleSave();
    };

    const handleSave = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    const toggleItem = (key: string) => {
        setItems(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                enabled: !prev[key]?.enabled
            }
        }));
    };

    const updateDate = (key: string, date: Date) => {
        setItems(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                date
            }
        }));
    };

    const toggleNotify = (key: string) => {
        setItems(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                notify: !prev[key]?.notify
            }
        }));
    };

    const resetDate = (key: string, defaultMonths: number) => {
        setItems(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                date: addMonths(new Date(), defaultMonths)
            }
        }));
    };

    return (
        <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
            <Navbar />

            <main style={{ padding: '80px 24px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '800px', margin: '0 auto 48px' }}>
                    <span style={{
                        padding: '6px 16px',
                        background: 'var(--card-bg)',
                        color: 'var(--primary)',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600',
                        marginBottom: '16px',
                        display: 'inline-block',
                        border: '1px solid var(--card-border)'
                    }}>
                        AKILLI BAKIM TAKİP
                    </span>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: '800',
                        marginBottom: '16px',
                        background: 'linear-gradient(to right, var(--foreground), var(--text-muted))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Bakım Ajandası
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.6' }}>
                        Aracınızın tüm bakım ve yasal yükümlülüklerini tek yerden yönetin.
                        Hatırlatıcılar oluşturun, tarihleri takip edin.
                    </p>
                </div>

                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Profile Card */}
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '20px',
                        padding: '32px',
                        marginBottom: '48px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                background: 'var(--secondary)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--card-border)'
                            }}>
                                <Wrench size={22} color="var(--primary)" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)' }}>Araç Profili</h2>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Yakıt tipi ve yıllık kullanım bilgilerinizi girin</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', alignItems: 'end' }}>
                            {/* Fuel Type */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>
                                    Yakıt Tipi
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                    {(["Benzin", "Dizel", "Elektrik"] as FuelType[]).map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => {
                                                setSelectedFuelType(type);
                                                setActiveFuelType(type);
                                            }}
                                            style={{
                                                padding: '12px',
                                                borderRadius: '12px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                transition: 'all 0.2s',
                                                background: selectedFuelType === type ? 'var(--primary)' : 'var(--secondary)',
                                                color: selectedFuelType === type ? 'white' : 'var(--foreground)',
                                            }}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* KM Input */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    Yıllık Ortalama Kilometre
                                    <span style={{
                                        fontSize: '11px',
                                        padding: '2px 8px',
                                        background: 'var(--secondary)',
                                        color: 'var(--text-muted)',
                                        borderRadius: '6px',
                                        fontWeight: '500',
                                        border: '1px solid var(--card-border)'
                                    }}>
                                        Düzenlenebilir
                                    </span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={annualKmInput}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val.length <= 6) {
                                                setAnnualKmInput(val);
                                                // Auto-update when valid number
                                                const numVal = parseInt(val) || 15000;
                                                const clampedKm = Math.min(Math.max(numVal, 1000), 100000);
                                                setActiveAnnualKm(clampedKm);
                                            }
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '14px 50px 14px 16px',
                                            background: 'var(--input-bg)',
                                            border: '2px solid var(--card-border)',
                                            borderRadius: '12px',
                                            color: 'var(--foreground)',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            outline: 'none',
                                            fontFamily: 'monospace',
                                            transition: 'all 0.2s',
                                            cursor: 'text',
                                            boxShadow: 'none'
                                        }}
                                        placeholder="Örn: 15000"
                                        onFocus={(e) => {
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15)';
                                            e.currentTarget.style.borderColor = '#2563eb';
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.borderColor = 'var(--card-border)';
                                        }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        pointerEvents: 'none'
                                    }}>
                                        KM
                                    </span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={handleCalculate}
                                style={{
                                    padding: '14px 32px',
                                    borderRadius: '12px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    fontWeight: '700',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    transition: 'transform 0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <RefreshCw className="w-4 h-4" />
                                Hesapla ve Güncelle
                            </button>
                        </div>
                    </div>

                    {/* Legal Calendar Section */}
                    <section style={{ marginBottom: '64px' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                Yasal Yükümlülükler
                            </h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                Zorunlu belgeler ve ödemeler için hatırlatıcılar
                            </p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            <InteractiveCard
                                title="Araç Muayenesi"
                                icon={<FileCheck />}
                                color="#0d9488"
                                item={items["inspection"]}
                                onToggle={() => toggleItem("inspection")}
                                onDateChange={(d) => updateDate("inspection", d)}
                                onToggleNotify={() => toggleNotify("inspection")}
                                onReset={() => resetDate("inspection", 24)}
                            />
                            <InteractiveCard
                                title="Trafik Sigortası"
                                icon={<ShieldCheck />}
                                color="#2563eb"
                                item={items["insurance"]}
                                onToggle={() => toggleItem("insurance")}
                                onDateChange={(d) => updateDate("insurance", d)}
                                onToggleNotify={() => toggleNotify("insurance")}
                                onReset={() => resetDate("insurance", 12)}
                            />
                            <InteractiveCard
                                title="MTV Ödemesi"
                                icon={<Receipt />}
                                color="#7c3aed"
                                item={items["mtv"]}
                                onToggle={() => toggleItem("mtv")}
                                onDateChange={(d) => updateDate("mtv", d)}
                                onToggleNotify={() => toggleNotify("mtv")}
                                onReset={() => resetDate("mtv", 6)}
                            />
                            <InteractiveCard
                                title="Kasko"
                                icon={<Car />}
                                color="#d97706"
                                item={items["kasko"]}
                                onToggle={() => toggleItem("kasko")}
                                onDateChange={(d) => updateDate("kasko", d)}
                                onToggleNotify={() => toggleNotify("kasko")}
                                onReset={() => resetDate("kasko", 12)}
                            />
                        </div>
                    </section>

                    {/* Maintenance Parts Section */}
                    <section>
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                                <div>
                                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                        Bakım Takip Listesi
                                    </h2>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                        Periyodik bakım ve parça değişim takibi
                                    </p>
                                </div>
                                <div style={{
                                    padding: '8px 16px',
                                    background: 'var(--secondary)',
                                    borderRadius: '12px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    color: 'var(--text-muted)'
                                }}>
                                    {activeFuelType} • {parseInt(activeAnnualKm.toString()).toLocaleString()} km/yıl
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            <SmartPartCard title="Periyodik Bakım" itemKey="maintenance" lifeKm={15000} userKm={activeAnnualKm} icon={<Wrench />} color="#4f46e5" item={items["maintenance"]} onToggle={() => toggleItem("maintenance")} onDateChange={(d) => updateDate("maintenance", d)} onToggleNotify={() => toggleNotify("maintenance")} onReset={() => resetDate("maintenance", 12)} />

                            {activeFuelType !== "Elektrik" && (
                                <>
                                    <SmartPartCard title="Motor Yağı" itemKey="oilChange" lifeKm={15000} userKm={activeAnnualKm} icon={<Droplet />} color="#2563eb" item={items["oilChange"]} onToggle={() => toggleItem("oilChange")} onDateChange={(d) => updateDate("oilChange", d)} onToggleNotify={() => toggleNotify("oilChange")} onReset={() => resetDate("oilChange", 12)} />
                                    <SmartPartCard title="Yağ Filtresi" itemKey="oilFilter" lifeKm={15000} userKm={activeAnnualKm} icon={<Filter />} color="#7c3aed" item={items["oilFilter"]} onToggle={() => toggleItem("oilFilter")} onDateChange={(d) => updateDate("oilFilter", d)} onToggleNotify={() => toggleNotify("oilFilter")} onReset={() => resetDate("oilFilter", 12)} />
                                    <SmartPartCard title="Hava Filtresi" itemKey="airFilter" lifeKm={20000} userKm={activeAnnualKm} icon={<Wind />} color="#0d9488" item={items["airFilter"]} onToggle={() => toggleItem("airFilter")} onDateChange={(d) => updateDate("airFilter", d)} onToggleNotify={() => toggleNotify("airFilter")} onReset={() => resetDate("airFilter", 18)} />
                                </>
                            )}

                            {activeFuelType === "Dizel" && (
                                <>
                                    <SmartPartCard title="Mazot Filtresi" itemKey="fuelFilter" lifeKm={30000} userKm={activeAnnualKm} icon={<Fuel />} color="#d97706" item={items["fuelFilter"]} onToggle={() => toggleItem("fuelFilter")} onDateChange={(d) => updateDate("fuelFilter", d)} onToggleNotify={() => toggleNotify("fuelFilter")} onReset={() => resetDate("fuelFilter", 24)} />
                                    <SmartPartCard title="DPF (Partikül)" itemKey="dpf" lifeKm={120000} userKm={activeAnnualKm} icon={<Sparkles />} color="#78716c" item={items["dpf"]} onToggle={() => toggleItem("dpf")} onDateChange={(d) => updateDate("dpf", d)} onToggleNotify={() => toggleNotify("dpf")} onReset={() => resetDate("dpf", 96)} />
                                </>
                            )}

                            {activeFuelType === "Benzin" && (
                                <>
                                    <SmartPartCard title="Benzin Filtresi" itemKey="fuelFilter" lifeKm={60000} userKm={activeAnnualKm} icon={<Fuel />} color="#d97706" item={items["fuelFilter"]} onToggle={() => toggleItem("fuelFilter")} onDateChange={(d) => updateDate("fuelFilter", d)} onToggleNotify={() => toggleNotify("fuelFilter")} onReset={() => resetDate("fuelFilter", 48)} />
                                    <SmartPartCard title="Bujiler" itemKey="sparkPlugs" lifeKm={50000} userKm={activeAnnualKm} icon={<Zap />} color="#ca8a04" item={items["sparkPlugs"]} onToggle={() => toggleItem("sparkPlugs")} onDateChange={(d) => updateDate("sparkPlugs", d)} onToggleNotify={() => toggleNotify("sparkPlugs")} onReset={() => resetDate("sparkPlugs", 40)} />
                                </>
                            )}

                            {activeFuelType !== "Elektrik" && (
                                <SmartPartCard title="Triger Seti" itemKey="trigerBelt" lifeKm={90000} userKm={activeAnnualKm} icon={<SettingsIcon />} color="#dc2626" item={items["trigerBelt"]} onToggle={() => toggleItem("trigerBelt")} onDateChange={(d) => updateDate("trigerBelt", d)} onToggleNotify={() => toggleNotify("trigerBelt")} onReset={() => resetDate("trigerBelt", 72)} />
                            )}

                            <SmartPartCard title="Polen Filtresi" itemKey="polenFilter" lifeKm={15000} userKm={activeAnnualKm} icon={<Leaf />} color="#65a30d" item={items["polenFilter"]} onToggle={() => toggleItem("polenFilter")} onDateChange={(d) => updateDate("polenFilter", d)} onToggleNotify={() => toggleNotify("polenFilter")} onReset={() => resetDate("polenFilter", 12)} />
                            <SmartPartCard title="Fren Balataları" itemKey="brakePads" lifeKm={45000} userKm={activeAnnualKm} icon={<Gauge />} color="#ea580c" item={items["brakePads"]} onToggle={() => toggleItem("brakePads")} onDateChange={(d) => updateDate("brakePads", d)} onToggleNotify={() => toggleNotify("brakePads")} onReset={() => resetDate("brakePads", 36)} />
                            <SmartPartCard title="Fren Hidroliği" itemKey="brakeFluid" lifeKm={40000} userKm={activeAnnualKm} icon={<Droplet />} color="#e11d48" item={items["brakeFluid"]} onToggle={() => toggleItem("brakeFluid")} onDateChange={(d) => updateDate("brakeFluid", d)} onToggleNotify={() => toggleNotify("brakeFluid")} onReset={() => resetDate("brakeFluid", 32)} />

                            <SmartPartCard
                                title={activeFuelType === "Elektrik" ? "Redüktör Yağı" : "Şanzıman Yağı"}
                                itemKey="transmissionFluid"
                                lifeKm={activeFuelType === "Elektrik" ? 80000 : 60000}
                                userKm={activeAnnualKm}
                                icon={<SettingsIcon />}
                                color="#6b7280"
                                item={items["transmissionFluid"]}
                                onToggle={() => toggleItem("transmissionFluid")}
                                onDateChange={(d) => updateDate("transmissionFluid", d)}
                                onToggleNotify={() => toggleNotify("transmissionFluid")}
                                onReset={() => resetDate("transmissionFluid", activeFuelType === "Elektrik" ? 64 : 48)}
                            />

                            <SmartPartCard title="Lastik Rotasyonu" itemKey="tireRotation" lifeKm={10000} userKm={activeAnnualKm} icon={<RefreshCw />} color="#4f46e5" item={items["tireRotation"]} onToggle={() => toggleItem("tireRotation")} onDateChange={(d) => updateDate("tireRotation", d)} onToggleNotify={() => toggleNotify("tireRotation")} onReset={() => resetDate("tireRotation", 8)} />
                            <SmartPartCard title="Antifriz" itemKey="coolant" lifeKm={45000} userKm={activeAnnualKm} icon={<Thermometer />} color="#0891b2" item={items["coolant"]} onToggle={() => toggleItem("coolant")} onDateChange={(d) => updateDate("coolant", d)} onToggleNotify={() => toggleNotify("coolant")} onReset={() => resetDate("coolant", 36)} />

                            <InteractiveCard
                                title="Akü (12V)"
                                subtitle="Ömür: 4-5 Yıl"
                                icon={<Battery />}
                                color="#0d9488"
                                item={items["battery"]}
                                onToggle={() => toggleItem("battery")}
                                onDateChange={(d) => updateDate("battery", d)}
                                onToggleNotify={() => toggleNotify("battery")}
                                onReset={() => resetDate("battery", 48)}
                            />
                        </div>
                    </section>
                </div>
            </main>

            <Footer />

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                padding: '32px',
                                borderRadius: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                maxWidth: '400px'
                            }}
                        >
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: 'rgba(34, 197, 94, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px'
                            }}>
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '8px' }}>
                                Güncellendi!
                            </h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center' }}>
                                Bakım takvimi başarıyla hesaplandı.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Interactive Card Component ---

function InteractiveCard({
    title,
    subtitle,
    icon,
    color,
    item,
    onToggle,
    onDateChange,
    onToggleNotify,
    onReset
}: {
    title: string;
    subtitle?: string;
    icon: any;
    color: string;
    item?: MaintenanceItem;
    onToggle: () => void;
    onDateChange: (date: Date) => void;
    onToggleNotify: () => void;
    onReset: () => void;
}) {
    const [showDatePicker, setShowDatePicker] = useState(false);

    if (!item) return null;

    return (
        <div
            style={{
                background: 'var(--card-bg)',
                border: `1px solid var(--card-border)`,
                borderRadius: '16px',
                padding: '20px',
                transition: 'all 0.3s ease',
                opacity: item.enabled ? 1 : 0.5,
                position: 'relative'
            }}
            onMouseEnter={(e) => {
                if (item.enabled) {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--card-border)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {/* Header with Icon and Toggle */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={{
                        padding: '10px',
                        borderRadius: '12px',
                        background: `${color}14`,
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '2px' }}>
                            {title}
                        </h4>
                        {subtitle && (
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Toggle */}
                <button
                    onClick={onToggle}
                    style={{
                        width: '40px',
                        height: '22px',
                        borderRadius: '11px',
                        background: item.enabled ? 'var(--primary)' : 'var(--secondary)',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        cursor: 'pointer',
                        flexShrink: 0
                    }}
                    title={item.enabled ? "Hatırlatıcıyı Kapat" : "Hatırlatıcıyı Aç"}
                >
                    <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: '3px',
                        left: item.enabled ? '21px' : '3px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                </button>
            </div>

            {/* Date Section */}
            {item.enabled && (
                <div style={{
                    background: 'var(--secondary)',
                    borderRadius: '12px',
                    padding: '12px'
                }}>
                    <div style={{
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <span>Hedef Tarih</span>
                        <button
                            onClick={onReset}
                            style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                background: 'transparent',
                                border: '1px solid var(--card-border)',
                                color: 'var(--primary)',
                                fontSize: '10px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--secondary)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <RotateCcw className="w-3 h-3" />
                            Sıfırla
                        </button>
                    </div>

                    {!showDatePicker ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)' }}>
                                    {formatDate(item.date)}
                                </span>
                            </div>
                            <button
                                onClick={() => setShowDatePicker(true)}
                                style={{
                                    padding: '6px',
                                    borderRadius: '8px',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <Edit2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="date"
                                value={formatDateInput(item.date)}
                                onChange={(e) => {
                                    const newDate = new Date(e.target.value);
                                    onDateChange(newDate);
                                }}
                                style={{
                                    flex: 1,
                                    background: 'var(--input-bg)',
                                    border: '1px solid var(--input-border)',
                                    borderRadius: '8px',
                                    padding: '8px',
                                    color: 'var(--foreground)',
                                    fontSize: '13px',
                                    outline: 'none'
                                }}
                            />
                            <button
                                onClick={() => setShowDatePicker(false)}
                                style={{
                                    padding: '8px',
                                    borderRadius: '8px',
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Check className="w-4 h-4 text-emerald-500" />
                            </button>
                        </div>
                    )}

                    {/* Reminder Options */}
                    <div style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--card-border)'
                    }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: 'var(--foreground)'
                        }}>
                            <input
                                type="checkbox"
                                checked={item.notify}
                                onChange={onToggleNotify}
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    cursor: 'pointer',
                                    accentColor: 'var(--primary)'
                                }}
                            />
                            <Bell className="w-3.5 h-3.5" style={{ color: item.notify ? 'var(--primary)' : 'var(--text-muted)' }} />
                            <span>Zaman gelince bildirim gönder</span>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}

function SmartPartCard({
    title,
    itemKey,
    lifeKm,
    userKm,
    icon,
    color,
    item,
    onToggle,
    onDateChange,
    onToggleNotify,
    onReset
}: {
    title: string;
    itemKey: string;
    lifeKm: number;
    userKm: number;
    icon: any;
    color: string;
    item?: MaintenanceItem;
    onToggle: () => void;
    onDateChange: (date: Date) => void;
    onToggleNotify: () => void;
    onReset: () => void;
}) {
    const { text } = calculateAutoDateAndText(lifeKm, userKm);

    return (
        <InteractiveCard
            title={title}
            subtitle={text}
            icon={icon}
            color={color}
            item={item}
            onToggle={onToggle}
            onDateChange={onDateChange}
            onToggleNotify={onToggleNotify}
            onReset={onReset}
        />
    );
}
