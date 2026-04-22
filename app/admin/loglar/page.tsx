"use client";

import { useState, useEffect, useCallback } from "react";
import {
    RefreshCw, Ban, Undo2, AlertTriangle, UserCheck, UserX,
    Pin, PinOff, Lock, Unlock, Trash2, CheckCircle, XCircle,
    Clock, Search, X, Activity
} from "lucide-react";

interface LogEntry {
    action: string;
    target: string;
    admin: string;
    detail: string;
    time: string;
}

const actionConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    BAN: { icon: <Ban size={14} />, color: '#EF4444', label: 'Ban' },
    UNBAN: { icon: <Undo2 size={14} />, color: '#10B981', label: 'Affet' },
    WARN: { icon: <AlertTriangle size={14} />, color: '#F59E0B', label: 'Uyarı' },
    ROLE: { icon: <UserCheck size={14} />, color: '#3B82F6', label: 'Rol Değişikliği' },
    PIN: { icon: <Pin size={14} />, color: '#F59E0B', label: 'Sabitleme' },
    UNPIN: { icon: <PinOff size={14} />, color: '#6B7280', label: 'Sabitleme Kaldır' },
    LOCK: { icon: <Lock size={14} />, color: '#EF4444', label: 'Kilitleme' },
    UNLOCK: { icon: <Unlock size={14} />, color: '#10B981', label: 'Kilit Açma' },
    DELETE_THREAD: { icon: <Trash2 size={14} />, color: '#EF4444', label: 'Başlık Silme' },
    APPROVE_LISTING: { icon: <CheckCircle size={14} />, color: '#10B981', label: 'İlan Onaylama' },
    REJECT_LISTING: { icon: <XCircle size={14} />, color: '#EF4444', label: 'İlan Reddi' },
};

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterAction, setFilterAction] = useState("hepsi");

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin?section=logs');
            const data = await res.json();
            if (data.success) setLogs(data.logs);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    const filtered = logs.filter(l => {
        const matchSearch = !search ||
            l.target.toLowerCase().includes(search.toLowerCase()) ||
            l.detail.toLowerCase().includes(search.toLowerCase());
        const matchAction = filterAction === "hepsi" || l.action === filterAction;
        return matchSearch && matchAction;
    });

    const actionTypes = ["hepsi", "BAN", "UNBAN", "WARN", "ROLE", "PIN", "LOCK", "DELETE_THREAD", "APPROVE_LISTING", "REJECT_LISTING"];

    return (
        <div style={{ position: 'relative', paddingBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px' }}>
                        Sistem Logları
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        Bu oturumda yapılan tüm admin işlem kayıtları · {logs.length} kayıt
                    </p>
                </div>
                <button onClick={fetchLogs} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--foreground)', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                    <RefreshCw size={14} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} /> Yenile
                </button>
            </div>

            {/* Filtreler */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '0 12px', height: '40px', width: '240px', gap: '8px' }}>
                    <Search size={14} style={{ color: 'var(--text-muted)' }} />
                    <input type="text" placeholder="Hedef veya detay ara..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--foreground)', fontSize: '13px' }} />
                    {search && <button onClick={() => setSearch("")} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={13} /></button>}
                </div>
                <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
                    style={{ padding: '0 14px', height: '40px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--foreground)', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                    {actionTypes.map(a => (
                        <option key={a} value={a}>{a === "hepsi" ? "Tüm İŞlemler" : (actionConfig[a]?.label || a)}</option>
                    ))}
                </select>
            </div>

            {/* Log Listesi */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                    <RefreshCw size={32} style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
                    Yükleniyor...
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', color: 'var(--text-muted)' }}>
                    <Activity size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
                    <p style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
                        {logs.length === 0 ? "Henüz işlem kaydı yok" : "Eşleşen kayıt bulunamadı"}
                    </p>
                    <p style={{ fontSize: '13px', color: 'var(--text-subtle)', margin: 0 }}>
                        {logs.length === 0
                            ? "Kullanıcı ban, başlık kilitleme, ilan onaylama gibi bir işlem yapıldığında tüm kayıtlar burada görünür."
                            : "Farklı filtre deneyin."
                        }
                    </p>
                </div>
            ) : (
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.02)' }}>
                                {["İŞlem", "Hedef", "Detay", "Zaman"].map(h => (
                                    <th key={h} style={{ textAlign: 'left', padding: '13px 20px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((log, i) => {
                                const cfg = actionConfig[log.action] || { icon: <Activity size={14} />, color: '#6B7280', label: log.action };
                                return (
                                    <tr key={i} style={{ borderBottom: i !== filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.015)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <td style={{ padding: '13px 20px' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '4px 10px', borderRadius: '8px', background: `${cfg.color}15`, color: cfg.color, fontSize: '12px', fontWeight: '700' }}>
                                                {cfg.icon}{cfg.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: '13px 20px', fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>{log.target}</td>
                                        <td style={{ padding: '13px 20px', fontSize: '13px', color: 'var(--text-muted)', maxWidth: '300px' }}>{log.detail}</td>
                                        <td style={{ padding: '13px 20px', fontSize: '12px', color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>
                                            <Clock size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                            {log.time}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
