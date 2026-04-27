"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, Settings, User, LogOut, MessageCircle, Wrench, Briefcase, Crown, Sun, Moon } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import CarThemeToggle from "@/components/CarThemeToggle";
import { subscribeToNotifications, markNotificationRead, markAllRead, type Notification as FBNotification } from "@/lib/notificationService";
import { subscribeToConversations, type Conversation as FBConversation } from "@/lib/messageService";
import { playNotificationSound, preloadNotificationSound } from "@/lib/notificationSound";

interface NavNotification {
    id: string;
    type: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    link?: string;
    avatar?: string;
}

interface NavMessage {
    id: string;
    user: string;
    avatar: string;
    message: string;
    time: string;
    unread: boolean;
    isOnline: boolean;
}

function formatTimeAgo(ts: any): string {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Simdi';
    if (diff < 3600) return `${Math.floor(diff / 60)} dk`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} saat`;
    return `${Math.floor(diff / 86400)} gun`;
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
    like: {
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>,
        color: "bg-pink-500/20 text-pink-400"
    },
    reply: {
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>,
        color: "bg-blue-500/20 text-blue-400"
    },
    follow: {
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
        color: "bg-emerald-500/20 text-emerald-400"
    },
    mention: {
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>,
        color: "bg-purple-500/20 text-purple-400"
    },
    system: {
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        color: "bg-neutral-500/20 text-neutral-400"
    },
    achievement: {
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
        color: "bg-amber-500/20 text-amber-400"
    },
};

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [notifications, setNotifications] = useState<NavNotification[]>([]);
    const [messages, setMessages] = useState<NavMessage[]>([]);
    const prevNotifCount = useRef(0);
    const prevMsgCount = useRef(0);

    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const isLoggedIn = !!user;

    // Preload notification sound
    useEffect(() => { preloadNotificationSound(); }, []);

    // Subscribe to Firebase notifications
    useEffect(() => {
        if (!user?.id) return;
        const unsub = subscribeToNotifications(user.id as string, (fbNotifs) => {
            const mapped: NavNotification[] = fbNotifs.map(n => ({
                id: n.id,
                type: n.type,
                title: n.title,
                message: n.message,
                time: formatTimeAgo(n.createdAt),
                read: n.read,
                avatar: n.title.charAt(0),
            }));
            // Play sound if new unread notification arrived
            const newUnread = mapped.filter(n => !n.read).length;
            if (newUnread > prevNotifCount.current && prevNotifCount.current >= 0) {
                playNotificationSound();
            }
            prevNotifCount.current = newUnread;
            setNotifications(mapped);
        });
        return () => unsub();
    }, [user?.id]);

    // Subscribe to Firebase conversations for message count
    useEffect(() => {
        if (!user?.id) return;
        const unsub = subscribeToConversations(user.id as string, (convs) => {
            const mapped: NavMessage[] = convs
                .filter(c => c.lastMessage)
                .map(c => {
                    const otherId = c.participants.find(p => p !== user?.id) || '';
                    const otherName = c.participantUsernames?.[otherId] || 'Kullanici';
                    return {
                        id: c.id,
                        user: otherName,
                        avatar: otherName.charAt(0).toUpperCase(),
                        message: c.lastMessage,
                        time: formatTimeAgo(c.lastMessageAt),
                        unread: c.lastSenderId !== user?.id && !!c.lastMessage,
                        isOnline: false,
                    };
                });
            const newUnread = mapped.filter(m => m.unread).length;
            if (newUnread > prevMsgCount.current && prevMsgCount.current >= 0) {
                playNotificationSound();
            }
            prevMsgCount.current = newUnread;
            setMessages(mapped);
        });
        return () => unsub();
    }, [user?.id]);

    const unreadNotifications = notifications.filter(n => !n.read).length;
    const unreadMessages = messages.filter(m => m.unread).length;

    const closeAllDropdowns = () => {
        setShowNotifications(false);
        setShowMessages(false);
        setShowProfileMenu(false);
    };

    const handleNotificationClick = (notification: NavNotification) => {
        markNotificationRead(notification.id);
        closeAllDropdowns();
    };

    const handleMarkAllRead = async () => {
        if (user?.id) {
            await markAllRead(user.id as string);
        }
    };


    const navLinks = [
        { name: 'FORUM', href: '/' },
        { name: 'ANKET', href: '/anket' },
        { name: 'UZMANA SOR', href: '/uzmana-sor' },
        { name: 'KARŞILAŞTIRMA', href: '/karsilastirma' },
        { name: 'ARAÇ DNA', href: '/arac-dna' },
        { name: 'KÜTÜPHANE', href: '/kutuphane' },
        { name: 'HABERLER', href: '/haberler' },
        { name: 'YAKIT', href: '/yakit-hesaplama' },
        { name: 'PAZAR', href: '/pazar' },
        { name: 'ETKİNLİKLER', href: '/etkinlikler' },
        { name: 'GÜVENMETRE', href: '/guvenmetre' },
        { name: 'PİYASALAR', href: '/piyasalar' },
    ];

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            background: 'var(--navbar-bg)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--card-border)',
            padding: '0 20px',
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '60px',
                gap: '16px',
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexShrink: 0,
                }}>
                    <div style={{ position: 'relative', width: '32px', height: '32px' }}>
                        <Image
                            src={theme === 'light' ? "/whitemode_logo.svg" : "/dark_logo.svg"}
                            alt="Otosöz"
                            fill
                            sizes="32px"
                            style={{ objectFit: 'contain' }}
                            priority
                            fetchPriority="high"
                        />
                    </div>
                    <span style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        color: 'var(--logo-text)',
                        whiteSpace: 'nowrap',
                    }}>
                        OTOSÖZ
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flex: 1,
                    justifyContent: 'center',
                }} className="desktop-nav">
                    {navLinks.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                style={{
                                    color: isActive ? 'var(--primary)' : 'var(--foreground)',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    background: isActive ? 'var(--hover-primary)' : 'transparent',
                                    transition: 'all 0.2s ease',
                                    whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'var(--hover-primary)';
                                        e.currentTarget.style.color = 'var(--primary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--foreground)';
                                    }
                                }}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Search & Actions */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexShrink: 0,
                }}>
                    {/* Logged In - Show Messages, Notifications, Settings, Profile */}
                    {/* Logged In - Show Messages, Notifications, Settings, Profile */}
                    {isLoggedIn ? (
                        <>
                            {/* Messages Dropdown */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => { setShowMessages(!showMessages); setShowNotifications(false); setShowProfileMenu(false); }}
                                    style={{
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '8px',
                                        background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        position: 'relative',
                                    }}>
                                    <MessageCircle style={{ width: '16px', height: '16px', color: 'var(--foreground)' }} />
                                    {unreadMessages > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-2px',
                                            right: '-2px',
                                            width: '14px',
                                            height: '14px',
                                            background: '#00d09c',
                                            borderRadius: '50%',
                                            fontSize: '9px',
                                            fontWeight: '700',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>{unreadMessages}</span>
                                    )}
                                </button>

                                {/* Messages Panel */}
                                {showMessages && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: '8px',
                                        width: '320px',
                                        background: 'var(--dropdown-bg)',
                                        border: '1px solid var(--dropdown-border)',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 40px var(--overlay-bg)',
                                        overflow: 'hidden',
                                        zIndex: 1000,
                                    }}>
                                        <div style={{
                                            padding: '12px 16px',
                                            borderBottom: '1px solid var(--card-border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}>
                                            <h3 style={{ color: 'var(--text-white)', fontWeight: '700', fontSize: '14px', margin: 0 }}>Mesajlar</h3>
                                            <Link href="/mesajlar" onClick={closeAllDropdowns} style={{
                                                fontSize: '11px',
                                                color: 'var(--badge-unread)',
                                                textDecoration: 'none',
                                            }}>
                                                Tümünü Gör
                                            </Link>
                                        </div>
                                        <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                                            {messages.length === 0 && (
                                                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                                                    Henuz mesajiniz yok
                                                </div>
                                            )}
                                            {messages.map((msg) => (
                                                <Link
                                                    key={msg.id}
                                                    href="/mesajlar"
                                                    onClick={closeAllDropdowns}
                                                    style={{
                                                        display: 'flex',
                                                        gap: '12px',
                                                        padding: '12px 16px',
                                                        background: msg.unread ? 'rgba(0, 208, 156, 0.05)' : 'transparent',
                                                        borderBottom: '1px solid var(--border-subtle)',
                                                        textDecoration: 'none',
                                                        transition: 'background 0.2s',
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dropdown-hover)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = msg.unread ? 'rgba(0, 208, 156, 0.05)' : 'transparent'}
                                                >
                                                    <div style={{ position: 'relative' }}>
                                                        <div style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            borderRadius: '50%',
                                                            background: 'var(--primary)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'white',
                                                            fontWeight: '700',
                                                            fontSize: '14px',
                                                        }}>
                                                            {msg.avatar}
                                                        </div>
                                                        {msg.isOnline && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                bottom: 0,
                                                                right: 0,
                                                                width: '12px',
                                                                height: '12px',
                                                                background: '#00d09c',
                                                                border: '2px solid #111',
                                                                borderRadius: '50%',
                                                            }} />
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <span style={{ color: 'var(--text-white)', fontSize: '13px', fontWeight: '600' }}>@{msg.user}</span>
                                                            <span style={{ color: 'var(--text-subtle)', fontSize: '11px' }}>{msg.time}</span>
                                                        </div>
                                                        <p style={{
                                                            color: 'var(--text-dimmed)',
                                                            fontSize: '12px',
                                                            margin: '2px 0 0 0',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        }}>{msg.message}</p>
                                                    </div>
                                                    {msg.unread && <div style={{
                                                        width: '8px',
                                                        height: '8px',
                                                        background: '#00d09c',
                                                        borderRadius: '50%',
                                                        flexShrink: 0,
                                                        marginTop: '8px',
                                                    }} />}
                                                </Link>
                                            ))}
                                        </div>
                                        <div style={{ padding: '12px', borderTop: '1px solid var(--card-border)' }}>
                                            <Link
                                                href="/mesajlar"
                                                onClick={closeAllDropdowns}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    width: '100%',
                                                    padding: '8px',
                                                    background: 'var(--secondary)',
                                                    color: 'var(--text-white)',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    borderRadius: '8px',
                                                    textDecoration: 'none',
                                                    transition: 'opacity 0.2s',
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                                                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                            >
                                                <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Yeni Mesaj
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Notifications Dropdown */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => { setShowNotifications(!showNotifications); setShowMessages(false); setShowProfileMenu(false); }}
                                    style={{
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '8px',
                                        background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        position: 'relative',
                                    }}>
                                    <Bell style={{ width: '16px', height: '16px', color: 'var(--foreground)' }} />
                                    {unreadNotifications > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-2px',
                                            right: '-2px',
                                            width: '14px',
                                            height: '14px',
                                            background: '#ff4444',
                                            borderRadius: '50%',
                                            fontSize: '9px',
                                            fontWeight: '700',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>{unreadNotifications}</span>
                                    )}
                                </button>

                                {/* Notifications Panel */}
                                {showNotifications && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: '8px',
                                        width: '320px',
                                        background: 'var(--dropdown-bg)',
                                        border: '1px solid var(--dropdown-border)',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 40px var(--overlay-bg)',
                                        overflow: 'hidden',
                                        zIndex: 1000,
                                    }}>
                                        <div style={{
                                            padding: '12px 16px',
                                            borderBottom: '1px solid var(--card-border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}>
                                            <h3 style={{ color: 'var(--text-white)', fontWeight: '700', fontSize: '14px', margin: 0 }}>Bildirimler</h3>
                                            {unreadNotifications > 0 && (
                                                <button
                                                    onClick={handleMarkAllRead}
                                                    style={{
                                                        fontSize: '11px',
                                                        color: 'var(--primary)',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: 0,
                                                    }}>
                                                    Tumunu okundu isaretle
                                                </button>
                                            )}
                                        </div>
                                        <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                                            {notifications.length === 0 && (
                                                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                                                    Henuz bildiriminiz yok
                                                </div>
                                            )}
                                            {notifications.map((notification) => {
                                                const config = typeConfig[notification.type] || typeConfig['system'];
                                                return (
                                                    <button
                                                        key={notification.id}
                                                        onClick={() => handleNotificationClick(notification)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '12px 16px',
                                                            display: 'flex',
                                                            gap: '12px',
                                                            background: !notification.read ? 'rgba(255, 107, 0, 0.05)' : 'transparent',
                                                            borderBottom: '1px solid var(--border-subtle)',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            textAlign: 'left',
                                                            transition: 'background 0.2s',
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dropdown-hover)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = !notification.read ? 'rgba(255, 107, 0, 0.05)' : 'transparent'}
                                                    >
                                                        {notification.avatar ? (
                                                            <div style={{
                                                                width: '40px',
                                                                height: '40px',
                                                                borderRadius: '50%',
                                                                background: 'var(--primary)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: 'white',
                                                                fontWeight: '700',
                                                                fontSize: '14px',
                                                                flexShrink: 0,
                                                            }}>
                                                                {notification.avatar}
                                                            </div>
                                                        ) : (
                                                            <div style={{
                                                                width: '40px',
                                                                height: '40px',
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                flexShrink: 0,
                                                            }} className={config.color}>
                                                                {config.icon}
                                                            </div>
                                                        )}
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '8px' }}>
                                                                <p style={{
                                                                    color: 'white',
                                                                    fontSize: '13px',
                                                                    fontWeight: '600',
                                                                    margin: 0,
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                }}>{notification.title}</p>
                                                                <span style={{
                                                                    color: 'var(--text-subtle)',
                                                                    fontSize: '11px',
                                                                    whiteSpace: 'nowrap',
                                                                }}>{notification.time}</span>
                                                            </div>
                                                            <p style={{
                                                                color: 'var(--text-dimmed)',
                                                                fontSize: '12px',
                                                                margin: '2px 0 0 0',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}>{notification.message}</p>
                                                        </div>
                                                        {!notification.read && <div style={{
                                                            width: '8px',
                                                            height: '8px',
                                                            background: 'var(--primary)',
                                                            borderRadius: '50%',
                                                            flexShrink: 0,
                                                            marginTop: '8px',
                                                        }} />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>



                            {/* Profile */}
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '4px 10px 4px 4px',
                                        background: 'var(--secondary)',
                                        border: '1px solid var(--card-border)',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        background: 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        color: 'white',
                                    }}>
                                        {user?.name.charAt(0)}
                                    </div>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--foreground)' }}>
                                        {user?.name}
                                    </span>
                                </button>

                                {/* Profile Dropdown */}
                                {showProfileMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: '8px',
                                        width: '200px',
                                        background: 'var(--dropdown-bg)',
                                        border: '1px solid var(--dropdown-border)',
                                        borderRadius: '12px',
                                        padding: '8px',
                                        boxShadow: '0 10px 40px var(--overlay-bg)',
                                    }}>
                                        <Link href="/profil" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            color: 'var(--foreground)',
                                            fontSize: '13px',
                                        }}>
                                            <User style={{ width: '16px', height: '16px' }} />
                                            Profilim
                                        </Link>
                                        <Link href="/ajanda" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            color: 'var(--foreground)',
                                            fontSize: '13px',
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                            Ajanda
                                        </Link>
                                        <Link href="/ayarlar" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            color: 'var(--foreground)',
                                            fontSize: '13px',
                                        }}>
                                            <Settings style={{ width: '16px', height: '16px' }} />
                                            Ayarlar
                                        </Link>
                                        <Link href="/usta-ol" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            color: 'var(--foreground)',
                                            fontSize: '13px',
                                        }}>
                                            <Wrench style={{ width: '16px', height: '16px' }} />
                                            Usta Ol
                                        </Link>
                                        <Link href="/uzman-ol" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            color: 'var(--foreground)',
                                            fontSize: '13px',
                                        }}>
                                            <Briefcase style={{ width: '16px', height: '16px' }} />
                                            Uzman Ol
                                        </Link>
                                        <Link href="/premium" style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            color: '#3b82f6',
                                            fontWeight: '700',
                                            fontSize: '13px',
                                            textDecoration: 'none'
                                        }}>
                                            <Crown style={{ width: '16px', height: '16px' }} />
                                            Premium'a Geç
                                        </Link>
                                        <div style={{ height: '1px', background: 'var(--card-border)', margin: '4px 0' }} />
                                        <div style={{ padding: '4px 10px' }}>
                                            <button onClick={() => toggleTheme()} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '6px',
                                                borderRadius: '8px',
                                                color: 'var(--foreground)',
                                                fontSize: '13px',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                width: '100%',
                                                textAlign: 'left'
                                            }}>
                                                {theme === 'dark' ? <Sun style={{ width: '16px', height: '16px' }} /> : <Moon style={{ width: '16px', height: '16px' }} />}
                                                {theme === 'dark' ? 'Aydınlık Mod' : 'Karanlık Mod'}
                                            </button>
                                        </div>
                                        <div style={{ height: '1px', background: 'var(--card-border)', margin: '4px 0' }} />
                                        <button
                                            onClick={() => logout()}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                color: '#ff4444',
                                                fontSize: '13px',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                            }}
                                        >
                                            <LogOut style={{ width: '16px', height: '16px' }} />
                                            Çıkış Yap
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Not Logged In - Show Auth Buttons */}
                            <Link href="/giris" style={{
                                padding: '6px 12px',
                                color: 'var(--foreground)',
                                fontSize: '11px',
                                fontWeight: '600',
                                borderRadius: '6px',
                                border: '1px solid var(--card-border)',
                                whiteSpace: 'nowrap',
                            }}
                                onClick={() => { }}
                            >
                                GİRİŞ
                            </Link>

                            <Link href="/kayit" style={{
                                padding: '6px 12px',
                                background: 'var(--primary)',
                                color: 'white',
                                fontSize: '11px',
                                fontWeight: '600',
                                borderRadius: '6px',
                                whiteSpace: 'nowrap',
                            }}>
                                KAYIT
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            padding: '6px',
                            color: 'var(--foreground)',
                        }}
                        className="mobile-menu-btn"
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            top: '60px',
                            background: 'rgba(0,0,0,0.3)',
                            zIndex: 998,
                        }}
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div style={{
                        position: 'absolute',
                        top: '60px',
                        left: 0,
                        right: 0,
                        background: 'var(--navbar-bg)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid var(--card-border)',
                        padding: '8px 16px 16px',
                        maxHeight: 'calc(100vh - 60px)',
                        overflowY: 'auto',
                        zIndex: 999,
                        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    }}>
                        {navLinks.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    style={{
                                        display: 'block',
                                        padding: '12px 16px',
                                        color: isActive ? 'var(--primary)' : 'var(--foreground)',
                                        fontSize: '14px',
                                        fontWeight: isActive ? '700' : '500',
                                        borderRadius: '10px',
                                        background: isActive ? 'var(--hover-primary)' : 'transparent',
                                        marginBottom: '2px',
                                        transition: 'all 0.15s ease',
                                    }}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                        
                        {/* Theme toggle in mobile menu */}
                        <div style={{ height: '1px', background: 'var(--card-border)', margin: '8px 0' }} />
                        <button
                            onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                color: 'var(--foreground)',
                                fontSize: '14px',
                                fontWeight: '500',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                width: '100%',
                                textAlign: 'left',
                            }}
                        >
                            {theme === 'dark' ? <Sun style={{ width: '16px', height: '16px' }} /> : <Moon style={{ width: '16px', height: '16px' }} />}
                            {theme === 'dark' ? 'Aydınlık Mod' : 'Karanlık Mod'}
                        </button>
                    </div>
                </>
            )}

            {/* Click outside to close dropdowns */}
            {(showNotifications || showProfileMenu || showMessages) && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 40,
                    }}
                    onClick={closeAllDropdowns}
                />
            )}
        </nav>
    );
}
