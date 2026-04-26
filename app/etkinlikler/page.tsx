"use client";

import { useState, useRef } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { events, eventCategories, cities, Event } from "@/data/events";

import { Calendar, MapPin, Users, TrendingUp, Award, Tag, X, CheckCircle, Upload, Sparkles } from "lucide-react";
import Link from "next/link";
import { sampleListings, formatListingPrice, formatKm } from "@/data/listings";

export default function EtkinliklerPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedCity, setSelectedCity] = useState<string>("Tümü");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '', category: '', city: '', date: '', time: '', location: '', description: ''
    });
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const TARGET_WIDTH = 800;
                const TARGET_HEIGHT = 450;
                canvas.width = TARGET_WIDTH;
                canvas.height = TARGET_HEIGHT;

                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const imgRatio = img.width / img.height;
                const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
                
                let drawWidth = img.width;
                let drawHeight = img.height;
                let offsetX = 0;
                let offsetY = 0;

                if (imgRatio > targetRatio) {
                    drawWidth = img.height * targetRatio;
                    offsetX = (img.width - drawWidth) / 2;
                } else {
                    drawHeight = img.width / targetRatio;
                    offsetY = (img.height - drawHeight) / 2;
                }

                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

                canvas.toBlob((blob) => {
                    if (blob) {
                        setImageBlob(blob);
                        setFilePreview(URL.createObjectURL(blob));
                    }
                }, 'image/jpeg', 0.8);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleSubmitEvent = async () => {
        if (!formData.title || !formData.category || !formData.city || !formData.date || !formData.time || !formData.location || !imageBlob) {
            alert("Lütfen tüm alanları doldurun ve bir görsel seçin.");
            return;
        }

        setIsSubmitting(true);
        try {
            // Upload Image
            const fileName = `events/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
            const imageRef = ref(storage, fileName);
            await uploadBytes(imageRef, imageBlob);
            const imageUrl = await getDownloadURL(imageRef);

            // Save to Firestore
            await addDoc(collection(db, "pending_events"), {
                ...formData,
                imageUrl,
                status: 'pending',
                createdAt: new Date().toISOString()
            });

            setShowAddModal(false);
            setShowSuccess(true);
            
            // Reset form
            setFormData({ title: '', category: '', city: '', date: '', time: '', location: '', description: '' });
            setImageBlob(null);
            setFilePreview(null);
        } catch (error) {
            console.error("Etkinlik eklenirken hata:", error);
            alert("Bir hata oluştu, lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    };


    const categoryTypes = ["all", ...Object.keys(eventCategories)];

    const filteredEvents = events.filter(event => {
        const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
        const matchesCity = selectedCity === "Tümü" || event.city === selectedCity;
        return matchesCategory && matchesCity;
    });

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Sub Header */}
                <div style={{
                    background: 'var(--card-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '16px 24px',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--foreground)' }}>Etkinlikler</h1>
                                <span style={{
                                    padding: '4px 10px',
                                    background: 'rgba(34, 197, 94, 0.2)',
                                    color: '#22c55e',
                                    fontSize: '11px',
                                    borderRadius: '9999px',
                                    fontWeight: '600',
                                }}>
                                    {filteredEvents.length} ETKİNLİK
                                </span>
                            </div>

                            <button 
                                onClick={() => setShowAddModal(true)}
                                style={{
                                padding: '10px 20px',
                                background: 'var(--primary)',
                                color: 'white',
                                fontWeight: '600',
                                borderRadius: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}>
                                + Etkinlik Ekle
                            </button>
                        </div>

                        {/* Category Pills */}
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '8px' }}>
                            {categoryTypes.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        whiteSpace: 'nowrap',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: selectedCategory === cat ? 'var(--primary)' : 'var(--secondary)',
                                        color: selectedCategory === cat ? 'white' : 'var(--foreground)',
                                    }}
                                >
                                    {cat === "all" ? "Tümü" : eventCategories[cat as keyof typeof eventCategories].label}
                                </button>
                            ))}
                        </div>

                        {/* City Pills */}
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {cities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => setSelectedCity(city)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        whiteSpace: 'nowrap',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: selectedCity === city ? 'var(--primary)' : 'var(--secondary)',
                                        color: selectedCity === city ? 'white' : 'var(--foreground)',
                                    }}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', gap: '24px' }}>
                        {/* Left Sidebar */}
                        <aside>
                            <div style={{
                                position: 'sticky',
                                top: '100px',
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '16px',
                            }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                    Kategoriler
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {categoryTypes.map((cat) => (
                                        <li key={cat} style={{ marginBottom: '4px' }}>
                                            <button
                                                onClick={() => setSelectedCategory(cat)}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '10px 12px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    background: selectedCategory === cat ? 'var(--primary)' : 'transparent',
                                                    color: selectedCategory === cat ? 'white' : 'var(--foreground)',
                                                    fontSize: '14px',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                <span>{cat === "all" ? "Tümü" : eventCategories[cat as keyof typeof eventCategories].label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>


                        </aside>

                        {/* Main Content */}
                        <div>
                            <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{filteredEvents.length} Etkinlik</span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button style={{
                                        padding: '8px 14px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: 'var(--primary)',
                                        color: 'white',
                                    }}>
                                        Yaklaşan
                                    </button>
                                    <button style={{
                                        padding: '8px 14px',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: 'transparent',
                                        color: 'var(--text-muted)',
                                    }}>
                                        Popüler
                                    </button>
                                </div>
                            </div>

                            {/* Events Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                {filteredEvents.map((event) => (
                                    <EventCard key={event.id} event={event} formatDate={formatDate} />
                                ))}
                            </div>

                            {filteredEvents.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                    <p>Bu kriterlere uygun etkinlik bulunamadı.</p>
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <aside>
                            <div style={{ position: 'sticky', top: '100px' }}>
                                {/* Popüler Etkinlikler */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    marginBottom: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <TrendingUp style={{ width: '14px', height: '14px' }} />
                                        Popüler Etkinlikler
                                    </h3>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {events.slice(0, 5).map((event, index) => (
                                            <li key={event.id} style={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '10px',
                                                padding: '10px 8px',
                                                borderRadius: '8px',
                                            }}>
                                                <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px' }}>{index + 1}</span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ color: 'var(--foreground)', fontSize: '13px', fontWeight: '600', lineHeight: 1.4 }}>{event.title}</div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{event.city}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* İstatistikler */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px' }}>
                                        İstatistikler
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {[
                                            { label: 'Toplam Etkinlik', value: events.length.toString() },
                                            { label: 'Aktif Şehir', value: cities.length.toString() },
                                            { label: 'Katılımcı', value: events.reduce((acc, e) => acc + (e.attendeesCount || 0), 0).toLocaleString() },
                                        ].map((stat) => (
                                            <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                                <span style={{ color: 'var(--text-muted)' }}>{stat.label}</span>
                                                <span style={{ color: 'var(--foreground)', fontWeight: '600' }}>{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Reklam Alanı */}
                                <Link href="/iletisim" style={{ textDecoration: 'none', display: 'block', marginTop: '16px' }}>
                                    <div style={{
                                        background: 'var(--secondary)', border: '1px dashed var(--card-border)', borderRadius: '16px',
                                        height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', padding: '20px', textAlign: 'center'
                                    }}
                                         onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                                         onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                                            <Sparkles size={20} color="currentColor" />
                                        </div>
                                        <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>Buraya Reklam Ver</h3>
                                        <p style={{ fontSize: '12px', lineHeight: '1.5', margin: 0 }}>Günde 10.000+ otomotiv tutkununa ulaşın.</p>
                                    </div>
                                </Link>

                                {/* Pazar Vitrini */}
                                <div style={{
                                    marginTop: '16px',
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>
                                            Pazar Vitrini
                                        </h3>
                                        <Link href="/pazar" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
                                            Tümü
                                        </Link>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {sampleListings.slice(0, 2).map((listing, index) => (
                                            <Link key={listing.id || index} href="/pazar" style={{ textDecoration: 'none' }}>
                                                <div style={{
                                                    background: 'var(--secondary)',
                                                    border: '1px solid var(--card-border)',
                                                    borderRadius: '12px',
                                                    padding: '12px',
                                                    transition: 'all 0.2s',
                                                    cursor: 'pointer'
                                                }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                                                >
                                                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {listing.brand} {listing.model}
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{listing.year} • {formatKm(listing.km)}</span>
                                                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#22c55e', whiteSpace: 'nowrap' }}>{formatListingPrice(listing.price)}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Add Event Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px', background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: '24px', width: '100%', maxWidth: '600px',
                        maxHeight: '90vh', overflow: 'auto', position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '24px', borderBottom: '1px solid var(--card-border)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 10
                        }}>
                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '4px' }}>
                                    Yeni Etkinlik Ekle
                                </h2>
                                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                                    Etkinliğinizi binlerce otomobil tutkunuyla paylaşın.
                                </p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} style={{
                                background: 'var(--secondary)', border: 'none',
                                width: '40px', height: '40px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--foreground)', cursor: 'pointer', transition: 'all 0.2s'
                            }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary)'}
                               onMouseLeave={(e) => e.currentTarget.style.background = 'var(--secondary)'}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'grid', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Etkinlik Adı</label>
                                    <input 
                                        type="text" 
                                        placeholder="Örn: İzmir Klasik Otomobil Festivali" 
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)',
                                        background: 'var(--secondary)', color: 'var(--foreground)', fontSize: '15px'
                                    }} />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Kategori</label>
                                        <select 
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)',
                                            background: 'var(--secondary)', color: 'var(--foreground)', fontSize: '15px'
                                        }}>
                                            <option value="">Seçiniz...</option>
                                            {Object.keys(eventCategories).map(cat => (
                                                <option key={cat} value={cat}>{eventCategories[cat as keyof typeof eventCategories].label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Şehir</label>
                                        <select 
                                            value={formData.city}
                                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                                            style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)',
                                            background: 'var(--secondary)', color: 'var(--foreground)', fontSize: '15px'
                                        }}>
                                            <option value="">Seçiniz...</option>
                                            {cities.filter(c => c !== 'Tümü').map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Tarih</label>
                                        <input 
                                            type="date" 
                                            value={formData.date}
                                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                                            style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)',
                                            background: 'var(--secondary)', color: 'var(--foreground)', fontSize: '15px'
                                        }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Saat</label>
                                        <input 
                                            type="time" 
                                            value={formData.time}
                                            onChange={(e) => setFormData({...formData, time: e.target.value})}
                                            style={{
                                            width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)',
                                            background: 'var(--secondary)', color: 'var(--foreground)', fontSize: '15px'
                                        }} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Tam Adres</label>
                                    <input 
                                        type="text" 
                                        placeholder="Açık adres giriniz..." 
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)',
                                        background: 'var(--secondary)', color: 'var(--foreground)', fontSize: '15px'
                                    }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Etkinlik Afişi / Fotoğrafı</label>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{
                                        border: '2px dashed var(--card-border)', borderRadius: '16px', padding: '32px',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                                        background: 'rgba(255,255,255,0.02)', cursor: 'pointer', position: 'relative', overflow: 'hidden'
                                    }}>
                                        {filePreview ? (
                                            <img src={filePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                                        ) : (
                                            <>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Upload style={{ color: 'var(--primary)' }} />
                                                </div>
                                                <div style={{ textAlign: 'center' }}>
                                                    <p style={{ color: 'var(--foreground)', fontWeight: '600', marginBottom: '4px' }}>Fotoğraf yüklemek için tıklayın</p>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>PNG, JPG, max 5MB (Otomatik kırpılır)</p>
                                                </div>
                                            </>
                                        )}
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            ref={fileInputRef} 
                                            onChange={handleImageSelect} 
                                            style={{ display: 'none' }} 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>Açıklama</label>
                                    <textarea 
                                        rows={4} 
                                        placeholder="Etkinlik hakkında detaylı bilgi verin..." 
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        style={{
                                        width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--card-border)',
                                        background: 'var(--secondary)', color: 'var(--foreground)', fontSize: '15px', resize: 'vertical'
                                    }}></textarea>
                                </div>
                            </div>

                            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                                <button onClick={() => setShowAddModal(false)} style={{
                                    padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'transparent',
                                    color: 'var(--text-muted)', fontWeight: '600', fontSize: '15px', cursor: 'pointer'
                                }}>
                                    İptal
                                </button>
                                <button 
                                    onClick={handleSubmitEvent} 
                                    disabled={isSubmitting}
                                    style={{
                                    padding: '12px 32px', borderRadius: '12px', border: 'none', background: 'var(--primary)',
                                    color: 'white', fontWeight: '700', fontSize: '15px', 
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    opacity: isSubmitting ? 0.7 : 1,
                                    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
                                }}>
                                    {isSubmitting ? 'Gönderiliyor...' : 'Onaya Gönder'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message Modal */}
            {showSuccess && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px', background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                        borderRadius: '24px', width: '100%', maxWidth: '440px', padding: '40px 32px',
                        textAlign: 'center', position: 'relative',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'rgba(16, 185, 129, 0.1)', color: '#10B981',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px'
                        }}>
                            <CheckCircle size={48} />
                        </div>
                        
                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '12px' }}>
                            Etkinlik Talebiniz Alındı!
                        </h3>
                        
                        <div style={{
                            background: 'var(--secondary)', borderRadius: '12px', padding: '16px',
                            marginBottom: '24px', textAlign: 'left'
                        }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                                Etkinliğiniz başarıyla oluşturuldu ve admin onayına gönderildi. 
                                <strong style={{ color: 'var(--foreground)', display: 'block', marginTop: '8px' }}>
                                    Değerlendirme süreci 48 saat sürebilir.
                                </strong>
                                Onaylandığında platformda yayınlanacaktır.
                            </p>
                        </div>

                        <button onClick={() => setShowSuccess(false)} style={{
                            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                            background: 'var(--primary)', color: 'white', fontWeight: '700',
                            fontSize: '16px', cursor: 'pointer', transition: 'all 0.2s'
                        }}>
                            Anladım, Kapat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function EventCard({ event, formatDate }: { event: Event; formatDate: (date: string) => string }) {
    return (
        <Link
            href={`/etkinlikler/${event.id}`}
            style={{ textDecoration: 'none' }}
        >
            <div
                style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.boxShadow = '0 0 20px var(--primary-glow)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--card-border)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                {/* Image */}
                <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden' }}>
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        padding: '4px 10px',
                        background: eventCategories[event.category].color,
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: 'white'
                    }}>
                        {eventCategories[event.category].label}
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '4px', fontSize: '11px', fontWeight: '600', color: 'var(--primary)' }}>
                        {event.city.toUpperCase()}
                    </div>

                    <h3 style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: 'var(--foreground)',
                        marginBottom: '8px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.3
                    }}>
                        {event.title}
                    </h3>

                    <p style={{
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                        marginBottom: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.4,
                        flex: 1
                    }}>
                        {event.description}
                    </p>

                    {/* Footer */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(event.date)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MapPin style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{event.location}</span>
                        </div>
                        {event.attendeesCount !== undefined && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Users style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{event.attendeesCount} katılımcı</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
