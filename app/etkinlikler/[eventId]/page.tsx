"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { events, getEventById, eventCategories, DaySchedule } from "@/data/events";
import { ArrowLeft, Calendar, MapPin, Users, Tag, Clock, Info, CheckCircle, XCircle, Share2, Heart, Bookmark, ExternalLink, Star, Building2 } from "lucide-react";
import Link from "next/link";

export default function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
    const router = useRouter();
    const { eventId } = use(params);
    const event = getEventById(eventId);

    if (!event) {
        return (
            <div>
                <Navbar />
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '24px', color: 'var(--foreground)', marginBottom: '16px' }}>Etkinlik Bulunamadı</h1>
                        <button
                            onClick={() => router.back()}
                            style={{
                                padding: '10px 20px',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Geri Dön
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('tr-TR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatShortDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short'
        });
    };

    // Get similar events (same city or category)
    const similarEvents = events.filter(e =>
        e.id !== event.id && (e.city === event.city || e.category === event.category)
    ).slice(0, 3);

    return (
        <div>
            <Navbar />

            <main style={{ minHeight: '100vh', background: 'var(--background)' }}>
                {/* Sub Header */}
                <div style={{
                    background: 'var(--overlay-bg)',
                    borderBottom: '1px solid var(--card-border)',
                    padding: '16px 24px',
                }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button
                                    onClick={() => router.back()}
                                    style={{
                                        width: '38px',
                                        height: '38px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        color: 'var(--foreground)',
                                    }}
                                >
                                    <ArrowLeft style={{ width: '20px', height: '20px' }} />
                                </button>
                                <div>
                                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>{event.title}</h1>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            background: eventCategories[event.category].color + '40',
                                            color: eventCategories[event.category].color,
                                            fontSize: '11px',
                                            borderRadius: '9999px',
                                            fontWeight: '600',
                                        }}>
                                            {eventCategories[event.category].label.toUpperCase()}
                                        </span>
                                        <span style={{
                                            padding: '4px 10px',
                                            background: 'var(--secondary)',
                                            color: 'var(--text-muted)',
                                            fontSize: '11px',
                                            borderRadius: '9999px',
                                        }}>
                                            {event.city}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={{
                                    padding: '10px 16px',
                                    background: 'var(--secondary)',
                                    color: 'var(--foreground)',
                                    fontWeight: '600',
                                    borderRadius: '10px',
                                    border: '1px solid var(--card-border)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <Share2 style={{ width: '16px', height: '16px' }} />
                                    Paylaş
                                </button>
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
                                    Katıl
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
                        {/* Main Content */}
                        <div>
                            {/* Hero Image with Stats Overlay */}
                            <div style={{
                                width: '100%',
                                height: '500px',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                marginBottom: '24px',
                                position: 'relative'
                            }}>
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                {/* Gradient Overlay */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 50%)'
                                }} />

                                {/* Bottom Stats */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '24px',
                                    left: '24px',
                                    right: '24px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'end'
                                }}>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        {event.tags.map(tag => (
                                            <span key={tag} style={{
                                                padding: '8px 16px',
                                                background: 'rgba(255,255,255,0.15)',
                                                backdropFilter: 'blur(10px)',
                                                borderRadius: '10px',
                                                fontSize: '12px',
                                                color: 'white',
                                                fontWeight: '600',
                                                border: '1px solid rgba(255,255,255,0.2)'
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div style={{
                                        padding: '12px 20px',
                                        background: event.isFree ? 'rgba(34, 197, 94, 0.9)' : 'rgba(255, 107, 0, 0.9)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}>
                                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', marginBottom: '2px' }}>Giriş Ücreti</div>
                                        <div style={{ fontSize: '20px', color: 'white', fontWeight: '700' }}>{event.priceText}</div>
                                    </div>
                                </div>

                                {/* Action Buttons Top Right */}
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    display: 'flex',
                                    gap: '8px'
                                }}>
                                    <button style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: 'rgba(0,0,0,0.5)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}>
                                        <Heart style={{ width: '20px', height: '20px', color: 'white' }} />
                                    </button>
                                    <button style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: 'rgba(0,0,0,0.5)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}>
                                        <Bookmark style={{ width: '20px', height: '20px', color: 'white' }} />
                                    </button>
                                </div>
                            </div>

                            {/* Event Info Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                                <InfoCard
                                    icon={<Calendar style={{ width: '20px', height: '20px' }} />}
                                    title="Tarih & Saat"
                                    value={formatDate(event.date)}
                                />
                                <InfoCard
                                    icon={<MapPin style={{ width: '20px', height: '20px' }} />}
                                    title="Konum"
                                    value={event.location}
                                />
                                <InfoCard
                                    icon={<Clock style={{ width: '20px', height: '20px' }} />}
                                    title="Süre"
                                    value={event.duration}
                                />
                            </div>

                            {/* Description */}
                            <div style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '24px',
                                marginBottom: '24px'
                            }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'rgba(255, 107, 0, 0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        📋
                                    </div>
                                    Etkinlik Hakkında
                                </h2>
                                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                                    {event.description}
                                </p>
                                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.8, marginTop: '16px' }}>
                                    Bu etkinlik {event.city} Şehrinde {event.organizer} tarafından düzenlenmektedir.
                                    {event.isOnline ? ' Online olarak ' : ' Belirlenen konumda yüz yüze '} gerçekleştirilecektir.
                                </p>
                            </div>

                            {/* Schedule (if available) */}
                            {event.schedule && (
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '24px',
                                    marginBottom: '24px'
                                }}>
                                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: 'rgba(255, 107, 0, 0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            📅
                                        </div>
                                        Haftalık Açılış Saatleri
                                    </h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                                        {event.schedule.map((day) => (
                                            <ScheduleRow key={day.dayName} day={day} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Map Placeholder */}
                            <div style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '24px',
                                marginBottom: '24px'
                            }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'rgba(255, 107, 0, 0.15)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        
                                    </div>
                                    Konum
                                </h2>
                                <div style={{
                                    width: '100%',
                                    height: '300px',
                                    background: 'var(--secondary)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    border: '1px solid var(--card-border)'
                                }}>
                                    <MapPin style={{ width: '40px', height: '40px', color: 'var(--text-muted)' }} />
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px' }}>
                                            {event.location}
                                        </div>
                                        <button style={{
                                            padding: '8px 16px',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            fontSize: '13px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <ExternalLink style={{ width: '14px', height: '14px' }} />
                                            Haritada Aç
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Similar Events */}
                            {similarEvents.length > 0 && (
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '24px'
                                }}>
                                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '16px' }}>
                                        Benzer Etkinlikler
                                    </h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                        {similarEvents.map((similarEvent) => (
                                            <Link key={similarEvent.id} href={`/etkinlikler/${similarEvent.id}`} style={{ textDecoration: 'none' }}>
                                                <div style={{
                                                    background: 'var(--secondary)',
                                                    border: '1px solid var(--card-border)',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.borderColor = 'var(--primary)';
                                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.borderColor = 'var(--card-border)';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                    }}>
                                                    <div style={{ position: 'relative', width: '100%', height: '120px' }}>
                                                        <img src={similarEvent.imageUrl} alt={similarEvent.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '8px',
                                                            right: '8px',
                                                            padding: '4px 8px',
                                                            background: 'rgba(0,0,0,0.7)',
                                                            borderRadius: '6px',
                                                            fontSize: '10px',
                                                            color: 'white',
                                                            fontWeight: '600'
                                                        }}>
                                                            {formatShortDate(similarEvent.date)}
                                                        </div>
                                                    </div>
                                                    <div style={{ padding: '12px' }}>
                                                        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {similarEvent.title}
                                                        </div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                            {similarEvent.city}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <aside>
                            <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* Organizer Card */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '20px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                        Organizatör
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '12px',
                                            background: 'var(--primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '20px',
                                            fontWeight: '700',
                                            color: 'white'
                                        }}>
                                            {event.organizer.charAt(0)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--foreground)', marginBottom: '2px' }}>
                                                {event.organizer}
                                            </div>
                                            {event.organizer !== 'Bilinmiyor' && (
                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Star style={{ width: '12px', height: '12px', fill: '#FFD700', color: '#FFD700' }} />
                                                    4.8 (120 değerlendirme)
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button style={{
                                        width: '100%',
                                        padding: '10px',
                                        background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '10px',
                                        color: 'var(--foreground)',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}>
                                        <Building2 style={{ width: '16px', height: '16px' }} />
                                        Profili Görüntüle
                                    </button>
                                </div>

                                {/* Stats */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '20px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Users style={{ width: '14px', height: '14px' }} />
                                        Katılımcı Bilgileri
                                    </h3>
                                    {event.attendeesCount !== null && event.maxAttendees !== null ? (
                                        <>
                                            <div style={{ marginBottom: '16px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Doluluk</span>
                                                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--foreground)' }}>
                                                        {Math.round((event.attendeesCount / event.maxAttendees) * 100)}%
                                                    </span>
                                                </div>
                                                <div style={{
                                                    width: '100%',
                                                    height: '10px',
                                                    background: 'var(--secondary)',
                                                    borderRadius: '5px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{
                                                        width: `${(event.attendeesCount / event.maxAttendees) * 100}%`,
                                                        height: '100%',
                                                        background: 'var(--primary)',
                                                    }} />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--secondary)', borderRadius: '10px', marginBottom: '12px' }}>
                                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Kayıtlı</span>
                                                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>{event.attendeesCount}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--secondary)', borderRadius: '10px' }}>
                                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Kapasite</span>
                                                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--foreground)' }}>{event.maxAttendees}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ padding: '20px', background: 'var(--secondary)', borderRadius: '10px', textAlign: 'center' }}>
                                            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Katılımcı bilgileri Şu an için bilinmiyor</span>
                                        </div>
                                    )}
                                </div>

                                {/* Quick Info */}
                                <div style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '16px',
                                    padding: '20px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                        Hızlı Bilgi
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <QuickInfoRow label="Etkinlik Tipi" value={event.isOnline ? "Online" : "Yüz Yüze"} />
                                        <QuickInfoRow label="Şehir" value={event.city} />
                                        <QuickInfoRow label="Süre" value={event.duration} />
                                        <QuickInfoRow label="Giriş" value={event.priceText} />
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.1), rgba(0, 212, 255, 0.1))',
                                    border: '1px solid var(--primary)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Info style={{ width: '14px', height: '14px' }} />
                                        Önemli Bilgi
                                    </h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                        Bu etkinlik {event.isOnline ? 'online olarak' : 'belirlenen konumda yüz yüze'} gerçekleştirilecektir.
                                        {!event.isFree && ' Giriş için ücret ödenmesi gerekmektedir.'}
                                        {' '}Katılım öncesi organizatörle iletişime geçmeniz önerilir.
                                    </p>
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

function InfoCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
    return (
        <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        }}>
            <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255, 107, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontSize: '15px', color: 'var(--foreground)', fontWeight: '600', lineHeight: 1.4 }}>{value}</div>
            </div>
        </div>
    );
}

function ScheduleRow({ day }: { day: DaySchedule }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            background: day.isOpen ? 'rgba(34, 197, 94, 0.1)' : 'var(--secondary)',
            borderRadius: '10px',
            border: `1px solid ${day.isOpen ? 'rgba(34, 197, 94, 0.3)' : 'var(--card-border)'}`
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {day.isOpen ? (
                    <CheckCircle style={{ width: '18px', height: '18px', color: '#22c55e' }} />
                ) : (
                    <XCircle style={{ width: '18px', height: '18px', color: '#EF4444' }} />
                )}
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)', minWidth: '90px' }}>
                    {day.dayName}
                </span>
            </div>
            <span style={{
                fontSize: '13px',
                color: day.isOpen ? 'var(--foreground)' : '#EF4444',
                fontWeight: day.isOpen ? '500' : '600'
            }}>
                {day.hours}
            </span>
        </div>
    );
}

function QuickInfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{label}</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--foreground)' }}>{value}</span>
        </div>
    );
}
