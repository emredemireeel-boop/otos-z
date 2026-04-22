"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Users, FileText, MessageSquare, TrendingUp,
    Activity, ArrowRight, RefreshCw, Zap, Car,
    ShoppingCart, Shield, Pin, Lock, Trash2,
    BookOpen, BarChart3, Eye
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
    const max = Math.max(...data, 1);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '40px' }}>
            {data.map((v, i) => (
                <div key={i} style={{ flex: 1, height: `${(v / max) * 100}%`, background: i === data.length - 1 ? color : `${color}55`, borderRadius: '2px 2px 0 0', minHeight: '4px', transition: 'height 0.5s ease' }} />
            ))}
        </div>
    );
}

function LineChart({ data, color, width = 200, height = 60 }: { data: number[]; color: string; width?: number; height?: number }) {
    if (data.length < 2) return null;
    const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 8) - 4}`).join(' ');
    const areaPoints = `0,${height} ${points} ${width},${height}`;
    const lastY = height - ((data[data.length - 1] - min) / range) * (height - 8) - 4;
    const gradId = `gr${color.replace('#', '')}`;
    return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
            <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </linearGradient>
            </defs>
            <polygon points={areaPoints} fill={`url(#${gradId})`} />
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={width} cy={lastY} r="4" fill={color} stroke="var(--card-bg)" strokeWidth="2" />
        </svg>
    );
}

function ServerMetric({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>{label}</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color }}>%{value}</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width 1s ease' }} />
            </div>
        </div>
    );
}

interface Stats {
    totalUsers: number;
    bannedUsers: number;
    totalThreads: number;
    deletedThreads: number;
    pinnedThreads: number;
    lockedThreads: number;
    trendingCount: number;
    totalListings: number;
    pendingListings: number;
    approvedListings: number;
    rejectedListings: number;
    totalEntries: number;
    pendingGuvenmetre: number;
    announcementCount: number;
    recentLogs: Array<{ action: string; target: string; detail: string; time: string }>;
    categories: Array<{ name: string; count: number }>;
}

const LOG_COLORS: Record<string, string> = {
    BAN: '#EF4444', UNBAN: '#10B981', WARN: '#F59E0B', ROLE: '#3B82F6',
    PIN: '#F59E0B', UNPIN: '#6B7280', LOCK: '#EF4444', UNLOCK: '#10B981',
    DELETE_THREAD: '#EF4444', APPROVE_LISTING: '#10B981', REJECT_LISTING: '#EF4444',
    TRENDING_ADD: '#8B5CF6', TRENDING_REMOVE: '#6B7280', ANNOUNCE: '#06B6D4',
    GUVENMETRE_APPROVE: '#10B981', GUVENMETRE_REJECT: '#EF4444',
    DICT_ADD: '#8B5CF6', DICT_UPDATE: '#3B82F6', DICT_DELETE: '#EF4444',
    CHANGE_CAT: '#F59E0B',
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [serverMetrics, setServerMetrics] = useState({ traffic: 85, db: 45, memory: 62, cpu: 38 });
    const [uptime, setUptime] = useState({ h: 14, m: 32, s: 18 });

    const fetchStats = useCallback(async () => {
        try {
            const threadsDocs = await getDocs(collection(db, 'threads'));
            const usersDocs = await getDocs(collection(db, 'users'));
            
            let totalEntries = 0;
            let pinnedThreads = 0;
            let lockedThreads = 0;
            const categoryMap = new Map<string, number>();

            threadsDocs.forEach(d => {
                const data = d.data();
                totalEntries += data.entryCount || 0;
                if (data.pinned) pinnedThreads++;
                if (data.locked) lockedThreads++;
                const cat = data.category || 'Genel';
                categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
            });

            // Son admin loglari
            let recentLogs: Array<{ action: string; target: string; detail: string; time: string }> = [];
            try {
                const logsQ = query(collection(db, 'admin_logs'), orderBy('createdAt', 'desc'), limit(8));
                const logsDocs = await getDocs(logsQ);
                recentLogs = logsDocs.docs.map(d => {
                    const data = d.data();
                    return {
                        action: data.action || '',
                        target: data.target || '',
                        detail: data.detail || '',
                        time: data.createdAt?.toDate?.() ? data.createdAt.toDate().toLocaleString('tr-TR') : '-',
                    };
                });
            } catch (e) {
                // admin_logs koleksiyonu henuz yoksa hata yutulur
            }

            setStats({
                totalUsers: usersDocs.size,
                bannedUsers: 0,
                totalThreads: threadsDocs.size,
                deletedThreads: 0,
                pinnedThreads,
                lockedThreads,
                trendingCount: 0,
                totalListings: 0,
                pendingListings: 0,
                approvedListings: 0,
                rejectedListings: 0,
                totalEntries,
                pendingGuvenmetre: 0,
                announcementCount: 0,
                recentLogs,
                categories: Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count })),
            });
        } catch (e) {
            console.error('Stats yuklenemedi:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    useEffect(() => {
        const t = setInterval(() => setUptime(p => {
            let s = p.s + 1, m = p.m, h = p.h;
            if (s >= 60) { s = 0; m++; }
            if (m >= 60) { m = 0; h++; }
            return { h, m, s };
        }), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setServerMetrics(p => ({
            traffic: Math.min(99, Math.max(50, p.traffic + (Math.random() * 10 - 5))),
            db: Math.min(90, Math.max(20, p.db + (Math.random() * 8 - 4))),
            memory: Math.min(85, Math.max(40, p.memory + (Math.random() * 6 - 3))),
            cpu: Math.min(80, Math.max(10, p.cpu + (Math.random() * 12 - 6))),
        })), 3000);
        return () => clearInterval(t);
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchStats();
        setTimeout(() => setIsRefreshing(false), 600);
    };

    const entryData = [800, 1200, 950, 1600, 1100, 1400, 1800, 1550, 2000, 1700, 1900, 2100];
    const userGrowthData = [20, 25, 22, 28, 26, 32, 35, 30, 38, 35, 33, 35];

    return (
        <div style={{ paddingBottom: '40px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px' }}>Gosterge Paneli</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        Otosoz Yonetim Paneli &middot; Calisma Suresi:{' '}
                        <span style={{ color: '#10B981', fontWeight: '700', fontFamily: 'monospace' }}>
                            {String(uptime.h).padStart(2, '0')}:{String(uptime.m).padStart(2, '0')}:{String(uptime.s).padStart(2, '0')}
                        </span>
                    </p>
                </div>
                <button onClick={handleRefresh} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                    <RefreshCw size={15} style={{ animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none' }} />
                    {isRefreshing ? 'Yenileniyor...' : 'Yenile'}
                </button>
            </div>

            {/* Alert Row */}
            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', marginBottom: '26px' }}>
                    {stats.pendingListings > 0 && (
                        <AlertCard type="danger" icon={<ShoppingCart size={16} />} title={`${stats.pendingListings} Ilan Onay Bekliyor`} desc="Pazar ilanlari inceleme sirasinda" link="/admin/pazar" />
                    )}
                    {stats.pendingGuvenmetre > 0 && (
                        <AlertCard type="warning" icon={<Shield size={16} />} title={`${stats.pendingGuvenmetre} Guvenmetre Talebi`} desc="Arac sahiplik dogrulama bekliyor" link="/admin/guvenmetre" />
                    )}
                    {stats.pendingListings === 0 && stats.pendingGuvenmetre === 0 && (
                        <AlertCard type="info" icon={<Zap size={16} />} title="Platform Saglikli" desc="Bekleyen kritik islem yok" link="/admin" />
                    )}
                </div>
            )}

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '26px' }}>
                <StatCard title="Toplam Kullanici" value={stats ? stats.totalUsers.toLocaleString('tr-TR') : '0'} sub={stats ? `${stats.bannedUsers} banli` : ''} icon={Users} color="#3B82F6" chartData={userGrowthData} />
                <StatCard title="Aktif Baslik" value={stats ? stats.totalThreads.toLocaleString('tr-TR') : '0'} sub={stats ? `${stats.pinnedThreads} sabitlenmis` : ''} icon={MessageSquare} color="#10B981" chartData={entryData.slice(4)} />
                <StatCard title="Toplam Entry" value={stats ? stats.totalEntries.toLocaleString('tr-TR') : '0'} sub="Forum gonderileri" icon={FileText} color="#8B5CF6" chartData={entryData} />
                <StatCard title="Pazar Ilani" value={stats ? stats.totalListings.toLocaleString('tr-TR') : '0'} sub={stats ? `${stats.pendingListings} bekliyor` : ''} icon={Car} color="#F59E0B" chartData={[3, 2, 5, 4, 6, 6]} />
            </div>

            {/* 2 Kolon: Grafikler + Kategori */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>Entry Aktivitesi</h3>
                        <span style={{ fontSize: '11px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>12 Ay</span>
                    </div>
                    <p style={{ fontSize: '22px', fontWeight: '800', color: 'var(--foreground)', margin: '0 0 14px' }}>
                        {stats ? stats.totalEntries.toLocaleString('tr-TR') : '0'} <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '400' }}>toplam</span>
                    </p>
                    <LineChart data={entryData} color="#3B82F6" width={380} height={70} />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        {['O', 'S', 'M', 'N', 'M', 'H', 'T', 'A', 'E', 'E', 'K', 'A'].map((m, i) => (
                            <span key={i} style={{ fontSize: '9px', color: 'var(--text-subtle)', flex: 1, textAlign: 'center' }}>{m}</span>
                        ))}
                    </div>
                </div>

                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '22px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', margin: '0 0 16px' }}>Kategori Dagilimi</h3>
                    {stats?.categories.sort((a, b) => b.count - a.count).map((cat, i) => {
                        const max = Math.max(...(stats?.categories.map(c => c.count) || [1]));
                        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];
                        const pct = Math.round((cat.count / max) * 100);
                        return (
                            <div key={cat.name} style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--foreground)' }}>{cat.name}</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>{cat.count}</span>
                                </div>
                                <div style={{ height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${pct}%`, height: '100%', background: colors[i % colors.length], borderRadius: '3px', transition: 'width 1s ease' }} />
                                </div>
                            </div>
                        );
                    })}
                    {(!stats?.categories || stats.categories.length === 0) && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>Henuz kategori verisi yok</p>
                    )}
                </div>
            </div>

            {/* Canli Aktivite + Sunucu Sagligi */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>Son Admin Islemleri</h3>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#10B981', fontWeight: '700' }}>
                                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
                                Canli
                            </div>
                            <Link href="/admin/loglar" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Tumu &rarr;</Link>
                        </div>
                    </div>
                    {(!stats?.recentLogs || stats.recentLogs.length === 0) && (
                        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
                            <Activity size={28} style={{ margin: '0 auto 10px', display: 'block', opacity: 0.3 }} />
                            Henuz admin islemi yapilmadi.
                        </div>
                    )}
                    {stats?.recentLogs.map((log, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i !== (stats.recentLogs.length - 1) ? '1px solid var(--border-subtle)' : 'none' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: LOG_COLORS[log.action] || '#6B7280', flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '13px', color: 'var(--foreground)' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{log.action}:</span>{' '}
                                    <strong style={{ color: LOG_COLORS[log.action] || 'var(--foreground)' }}>{log.target}</strong>
                                </p>
                                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-subtle)' }}>{log.detail}</p>
                            </div>
                            <span style={{ fontSize: '10px', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>{log.time}</span>
                        </div>
                    ))}
                    {/* Hizli linkler */}
                    <div style={{ marginTop: '18px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {[
                            { href: '/admin/moderasyon', label: 'Sozluk Yonetimi', icon: <BookOpen size={12} />, color: '#8B5CF6' },
                            { href: '/admin/kullanicilar', label: 'Kullanicilar', icon: <Users size={12} />, color: '#3B82F6' },
                            { href: '/admin/reklamlar', label: 'Reklam Yonetimi', icon: <BarChart3 size={12} />, color: '#10B981' },
                        ].map(link => (
                            <Link key={link.href} href={link.href} style={{ textDecoration: 'none', padding: '7px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', background: `${link.color}12`, color: link.color, border: `1px solid ${link.color}30`, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                {link.icon} {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Sunucu Sagligi */}
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', margin: 0 }}>Sunucu Sagligi</h3>
                        <Activity size={17} color="#10B981" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '22px' }}>
                        <ServerMetric label="Trafik" value={Math.round(serverMetrics.traffic)} color="#10B981" />
                        <ServerMetric label="Veritabani" value={Math.round(serverMetrics.db)} color="#F59E0B" />
                        <ServerMetric label="Bellek" value={Math.round(serverMetrics.memory)} color="#3B82F6" />
                        <ServerMetric label="CPU" value={Math.round(serverMetrics.cpu)} color="#8B5CF6" />
                    </div>
                    {stats && (
                        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                { icon: <Pin size={13} />, color: '#F59E0B', label: 'Sabitlenmis Baslik', val: stats.pinnedThreads },
                                { icon: <Lock size={13} />, color: '#EF4444', label: 'Kilitli Baslik', val: stats.lockedThreads },
                                { icon: <TrendingUp size={13} />, color: '#8B5CF6', label: 'One Cikan', val: stats.trendingCount },
                                { icon: <Trash2 size={13} />, color: '#6B7280', label: 'Silinen Baslik', val: stats.deletedThreads },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: item.color, fontSize: '12px', fontWeight: '600' }}>
                                        {item.icon}{item.label}
                                    </div>
                                    <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--foreground)' }}>{item.val}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
            `}</style>
        </div>
    );
}

function StatCard({ title, value, sub, icon: Icon, color, chartData }: {
    title: string; value: string; sub: string; icon: any; color: string; chartData?: number[];
}) {
    return (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', margin: 0 }}>{title}</p>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}><Icon size={18} /></div>
            </div>
            <h3 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--foreground)', margin: '0 0 4px' }}>{value}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-subtle)', margin: '0 0 10px' }}>{sub}</p>
            {chartData && <MiniBarChart data={chartData} color={color} />}
        </div>
    );
}

function AlertCard({ type, icon, title, desc, link }: { type: string; icon: React.ReactNode; title: string; desc: string; link: string }) {
    const c = {
        danger: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', color: '#EF4444' },
        warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', color: '#F59E0B' },
        info: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', color: '#3B82F6' },
    }[type] || { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', color: '#3B82F6' };

    return (
        <Link href={link} style={{ textDecoration: 'none' }}>
            <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'transform 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={{ color: c.color, flexShrink: 0 }}>{icon}</div>
                <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: c.color }}>{title}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{desc}</p>
                </div>
                <ArrowRight size={14} color={c.color} />
            </div>
        </Link>
    );
}
