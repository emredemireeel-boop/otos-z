import EventActionsClient from "@/components/EventActionsClient";
import ServerCatalogClient from "@/components/ServerCatalogClient";


import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { events, eventCategories, cities, Event } from "@/data/events";
import { getLegacyMarketPath, toMarketSlug } from "@/data/open-car-markets";

import { Calendar, MapPin, Users, TrendingUp, Award, Tag, X, CheckCircle, Upload, Sparkles } from "lucide-react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import LatestThreadsWidget from "@/components/LatestThreadsWidget";

export default async function EtkinliklerPage() {
    const selectedCategory: string='all',selectedCity: string='Tümü';
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
        <EventActionsClient cities={cities} categories={eventCategories}><ServerCatalogClient initialFilter="all">
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
                                    background: 'var(--secondary)',
                                    color: 'var(--foreground)',
                                    border: '1px solid var(--card-border)',
                                    fontSize: '11px',
                                    borderRadius: '9999px',
                                    fontWeight: '700',
                                    letterSpacing: '0.5px'
                                }}>
                                    {filteredEvents.length} ETKİNLİK
                                </span>
                            </div>

                            <button 
                                data-event-add
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
                        <div className="category-pills" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '8px' }}>
                            {categoryTypes.map((cat) => (
                                <button
                                    key={cat}
                                    data-catalog-filter={cat}
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


                    </div>
                </div>

                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                    <div className="home-main-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', gap: '24px' }}>
                        {/* Left Sidebar */}
                        <aside className="home-left-sidebar">
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
                                                data-catalog-filter={cat}
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

                                <div style={{ height: '1px', background: 'var(--card-border)', margin: '16px 0' }} />

                                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                    Şehirler
                                </h3>
                                <div style={{ maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                        {cities.map((city) => (
                                            <li key={city} style={{ marginBottom: '4px' }}>
                                                <button
                                                    data-catalog-city-target={city}
                                                    style={{
                                                        width: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: '8px 12px',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        background: selectedCity === city ? 'var(--primary)' : 'transparent',
                                                        color: selectedCity === city ? 'white' : 'var(--foreground)',
                                                        fontSize: '13px',
                                                        textAlign: 'left',
                                                    }}
                                                >
                                                    <span>{city}</span>
                                                    <span style={{ 
                                                        fontSize: '10px', 
                                                        padding: '2px 6px',
                                                        background: selectedCity === city ? 'rgba(255,255,255,0.2)' : 'var(--secondary)',
                                                        borderRadius: '4px',
                                                        fontWeight: '600',
                                                        color: selectedCity === city ? 'white' : 'var(--foreground)'
                                                    }}>
                                                        {events.filter(e => city === "Tümü" || e.city === city).length}
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
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
                        <aside className="home-right-sidebar">
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
                                <AdPlaceholder position="sidebar" style={{ marginTop: '16px' }} />

                                {/* Pazar Vitrini (Gizlendi) */}
                                <LatestThreadsWidget />

                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />

        </ServerCatalogClient></EventActionsClient>
    );
}

function EventCard({ event, formatDate }: { event: Event; formatDate: (date: string) => string }) {
    const marketPath = event.category === 'pazar'
        ? getLegacyMarketPath(event.id) ?? `/acik-oto-pazari/${toMarketSlug(event.city)}`
        : undefined;

    return (
        <Link
            data-catalog-row data-catalog-group={event.category} data-catalog-city={event.city}
            href={marketPath ?? `/etkinlikler/${event.id}`}
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
