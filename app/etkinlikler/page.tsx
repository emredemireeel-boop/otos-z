"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { events, eventCategories, cities, Event } from "@/data/events";

import { Calendar, MapPin, Users, TrendingUp, Award, Tag } from "lucide-react";
import Link from "next/link";

export default function EtkinliklerPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedCity, setSelectedCity] = useState<string>("Tümü");


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

                            <button style={{
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
                                    background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.1), rgba(0, 212, 255, 0.1))',
                                    border: '1px solid var(--primary)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Award style={{ width: '14px', height: '14px' }} />
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
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
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
