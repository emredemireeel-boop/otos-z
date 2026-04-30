"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Trash2, Search, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs, deleteDoc, doc, addDoc, serverTimestamp, increment, updateDoc } from "firebase/firestore";
import { formatTimestamp, type ForumThread, type ForumEntry } from "@/lib/forumService";

export default function AdminEntryKontrolPage() {
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [entries, setEntries] = useState<(ForumEntry & { threadId: string })[]>([]);
    const [loadingThreads, setLoadingThreads] = useState(true);
    const [loadingEntries, setLoadingEntries] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"threads" | "entries">("threads");
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [deletingThreadId, setDeletingThreadId] = useState<string | null>(null);
    const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

    const fetchThreads = async () => {
        setLoadingThreads(true);
        try {
            const q = query(collection(db, "threads"), orderBy("createdAt", "desc"), limit(50));
            const snap = await getDocs(q);
            const data = snap.docs.map(d => ({
                id: d.id,
                ...d.data(),
                // @ts-ignore
                createdAt: d.data().createdAt,
                // @ts-ignore
                lastEntryAt: d.data().lastEntryAt,
            })) as ForumThread[];
            setThreads(data);
        } catch (error) {
            console.error("Basliklar yuklenirken hata:", error);
        } finally {
            setLoadingThreads(false);
        }
    };

    const fetchEntries = async () => {
        setLoadingEntries(true);
        try {
            // Index hatasini asmak icin, once son guncellenen basliklari cekiyoruz
            const threadsQuery = query(collection(db, "threads"), orderBy("lastEntryAt", "desc"), limit(15));
            const threadsSnap = await getDocs(threadsQuery);
            
            let allRecentEntries: (ForumEntry & { threadId: string })[] = [];
            
            // Her baslik icin en son 5 entry'yi cekiyoruz (standart sorgu, index istemez)
            const entryPromises = threadsSnap.docs.map(async (threadDoc) => {
                const entriesQ = query(collection(db, "threads", threadDoc.id, "entries"), orderBy("createdAt", "desc"), limit(5));
                const entriesSnap = await getDocs(entriesQ);
                return entriesSnap.docs.map(e => ({
                    id: e.id,
                    threadId: threadDoc.id,
                    ...e.data(),
                    // @ts-ignore
                    createdAt: e.data().createdAt,
                })) as (ForumEntry & { threadId: string })[];
            });
            
            const results = await Promise.all(entryPromises);
            
            // Tum entryleri birlestirip tarihe gore siraliyoruz
            results.forEach(batch => {
                allRecentEntries = [...allRecentEntries, ...batch];
            });
            
            allRecentEntries.sort((a, b) => {
                const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
                const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
                return timeB - timeA;
            });
            
            setEntries(allRecentEntries.slice(0, 50));
        } catch (error) {
            console.error("Entryler yuklenirken hata:", error);
            setToast({ msg: "Entry'ler yüklenirken bir sorun oluştu.", type: "error" });
        } finally {
            setLoadingEntries(false);
        }
    };

    useEffect(() => {
        fetchThreads();
        fetchEntries();
    }, []);

    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);

    const handleDeleteThread = async (threadId: string, title: string) => {
        if (!confirm(`"${title}" başlıklı konuyu ve tüm entrylerini silmek istediğinize emin misiniz?`)) return;
        setDeletingThreadId(threadId);
        try {
            // Önce alt koleksiyon (entries) sil
            const entriesRef = collection(db, 'threads', threadId, 'entries');
            const entriesSnap = await getDocs(entriesRef);
            const deletePromises = entriesSnap.docs.map(d => deleteDoc(d.ref));
            if (deletePromises.length > 0) await Promise.all(deletePromises);

            // Thread'i sil
            await deleteDoc(doc(db, 'threads', threadId));

            // Log kaydet
            try {
                await addDoc(collection(db, 'admin_logs'), {
                    action: 'DELETE_THREAD',
                    target: threadId,
                    detail: `Başlık ve ${entriesSnap.size} entry silindi`,
                    admin: 'admin-panel',
                    createdAt: serverTimestamp(),
                });
            } catch (_) {}

            setToast({ msg: 'Başlık silindi ✓', type: 'success' });
            setThreads(prev => prev.filter(t => t.id !== threadId));
            setEntries(prev => prev.filter(e => e.threadId !== threadId));
        } catch (error: any) {
            console.error('Silme hatasi:', error);
            setToast({ msg: `Hata: ${error?.message || error}`, type: 'error' });
        } finally {
            setDeletingThreadId(null);
        }
    };

    const handleDeleteEntry = async (threadId: string, entryId: string) => {
        if (!confirm("Bu entry'yi silmek istediğinize emin misiniz?")) return;
        setDeletingEntryId(entryId);
        try {
            // Entry'yi sil
            await deleteDoc(doc(db, 'threads', threadId, 'entries', entryId));

            // Thread entryCount azalt
            try {
                await updateDoc(doc(db, 'threads', threadId), {
                    entryCount: increment(-1),
                });
            } catch (_) {}

            // Log kaydet
            try {
                await addDoc(collection(db, 'admin_logs'), {
                    action: 'DELETE_ENTRY',
                    target: entryId,
                    detail: `Thread: ${threadId}`,
                    admin: 'admin-panel',
                    createdAt: serverTimestamp(),
                });
            } catch (_) {}

            setToast({ msg: 'Entry silindi ✓', type: 'success' });
            setEntries(prev => prev.filter(e => e.id !== entryId));
            setThreads(prev => prev.map(t => t.id === threadId ? { ...t, entryCount: Math.max(0, t.entryCount - 1) } : t));
        } catch (error: any) {
            console.error('Entry silme hatasi:', error);
            setToast({ msg: `Hata: ${error?.message || error}`, type: 'error' });
        } finally {
            setDeletingEntryId(null);
        }
    };

    const filteredThreads = threads.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.authorUsername.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredEntries = entries.filter(e => 
        e.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
        e.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ paddingBottom: '40px' }}>
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
                    padding: '14px 24px', borderRadius: '12px',
                    background: toast.type === 'success' ? 'rgba(16,185,129,0.95)' : 'rgba(239,68,68,0.95)',
                    color: 'white', fontSize: '14px', fontWeight: '600',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                }}>
                    {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                    {toast.msg}
                </div>
            )}

            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MessageSquare size={28} color="#3B82F6" /> Entry ve Başlık Kontrolü
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Forum başlıklarını ve kullanıcıların girdiği entryleri görüntüleyin, kural dışı olanları silin.
                </p>
            </div>

            {/* Arama ve Tablar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '8px', background: 'var(--card-bg)', padding: '6px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                    <button 
                        onClick={() => setActiveTab("threads")}
                        style={{
                            padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                            background: activeTab === "threads" ? 'var(--primary)' : 'transparent',
                            color: activeTab === "threads" ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s'
                        }}
                    >
                        Başlıklar
                    </button>
                    <button 
                        onClick={() => setActiveTab("entries")}
                        style={{
                            padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                            background: activeTab === "entries" ? 'var(--primary)' : 'transparent',
                            color: activeTab === "entries" ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s'
                        }}
                    >
                        Entryler
                    </button>
                </div>

                <div style={{ minWidth: '250px', position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                        type="text" 
                        value={searchQuery} 
                        onChange={e => setSearchQuery(e.target.value)} 
                        placeholder="Ara (Başlık, yazar, içerik)..."
                        style={{ width: '100%', padding: '10px 16px 10px 40px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '10px', color: 'var(--foreground)', fontSize: '14px', outline: 'none' }} 
                    />
                </div>
            </div>

            {/* Listeler */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '16px', overflow: 'hidden' }}>
                {/* Başlıklar */}
                {activeTab === "threads" && (
                    <div>
                        {loadingThreads ? (
                            <div style={{ textAlign: 'center', padding: '60px' }}>
                                <div style={{ width: 40, height: 40, border: '3px solid var(--card-border)', borderTop: '3px solid #3B82F6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Başlıklar yükleniyor...</p>
                            </div>
                        ) : filteredThreads.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                <p>Başlık bulunamadı.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {filteredThreads.map(thread => (
                                    <div key={thread.id} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '16px 20px', borderBottom: '1px solid var(--card-border)',
                                        gap: '16px'
                                    }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {thread.title}
                                            </h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                                <span>Açan: <strong style={{ color: 'var(--foreground)' }}>@{thread.authorUsername}</strong></span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {formatTimestamp(thread.createdAt)}</span>
                                                <span>{thread.entryCount} entry</span>
                                                <span style={{ padding: '2px 6px', background: 'rgba(59,130,246,0.1)', color: '#3B82F6', borderRadius: '4px', fontWeight: '600' }}>{thread.category}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteThread(thread.id, thread.title)}
                                            disabled={deletingThreadId === thread.id}
                                            style={{
                                                padding: '8px 12px', background: deletingThreadId === thread.id ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                                borderRadius: '8px', color: '#EF4444', fontWeight: '600', cursor: deletingThreadId === thread.id ? 'wait' : 'pointer', fontSize: '13px',
                                                display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', flexShrink: 0,
                                                opacity: deletingThreadId === thread.id ? 0.7 : 1
                                            }}
                                            onMouseEnter={e => { if (!deletingThreadId) e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                                            onMouseLeave={e => { if (!deletingThreadId) e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                                        >
                                            {deletingThreadId === thread.id ? (
                                                <><div style={{ width: 14, height: 14, border: '2px solid rgba(239,68,68,0.3)', borderTop: '2px solid #EF4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Siliniyor...</>
                                            ) : (
                                                <><Trash2 size={14} /> Sil</>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Entryler */}
                {activeTab === "entries" && (
                    <div>
                        {loadingEntries ? (
                            <div style={{ textAlign: 'center', padding: '60px' }}>
                                <div style={{ width: 40, height: 40, border: '3px solid var(--card-border)', borderTop: '3px solid #3B82F6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Entryler yükleniyor...</p>
                            </div>
                        ) : filteredEntries.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                <p>Entry bulunamadı.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {filteredEntries.map(entry => (
                                    <div key={entry.id} style={{
                                        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                                        padding: '16px 20px', borderBottom: '1px solid var(--card-border)',
                                        gap: '16px'
                                    }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--foreground)', lineHeight: 1.5 }}>
                                                {entry.content}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                                <span>Yazar: <strong style={{ color: 'var(--foreground)' }}>@{entry.username}</strong></span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {formatTimestamp(entry.createdAt)}</span>
                                                <span>❤️ {entry.likes} beğeni</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteEntry(entry.threadId, entry.id)}
                                            disabled={deletingEntryId === entry.id}
                                            style={{
                                                padding: '8px 12px', background: deletingEntryId === entry.id ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                                borderRadius: '8px', color: '#EF4444', fontWeight: '600', cursor: deletingEntryId === entry.id ? 'wait' : 'pointer', fontSize: '13px',
                                                display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', flexShrink: 0,
                                                opacity: deletingEntryId === entry.id ? 0.7 : 1
                                            }}
                                            onMouseEnter={e => { if (!deletingEntryId) e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                                            onMouseLeave={e => { if (!deletingEntryId) e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                                        >
                                            {deletingEntryId === entry.id ? (
                                                <><div style={{ width: 14, height: 14, border: '2px solid rgba(239,68,68,0.3)', borderTop: '2px solid #EF4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Siliniyor...</>
                                            ) : (
                                                <><Trash2 size={14} /> Sil</>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
