"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { subscribeToThreads, getThreadSlugUrl, type ForumThread } from "@/lib/forumService";
import { Clock, ChevronRight } from "lucide-react";

export default function LatestThreadsWidget() {
    const [threads, setThreads] = useState<ForumThread[]>([]);

    useEffect(() => {
        const unsub = subscribeToThreads((allThreads) => {
            const sorted = [...allThreads].sort((a, b) => {
                const aTime = a.createdAt?.toMillis() || 0;
                const bTime = b.createdAt?.toMillis() || 0;
                return bTime - aTime;
            });
            setThreads(sorted.slice(0, 5));
        }, 10);
        return () => unsub();
    }, []);

    const getRelativeTime = (thread: ForumThread) => {
        if (!thread.createdAt) return '';
        const now = Date.now();
        const created = thread.createdAt.toMillis();
        const diff = now - created;
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'az önce';
        if (mins < 60) return `${mins}dk`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}sa`;
        const days = Math.floor(hours / 24);
        return `${days}g`;
    };

    return (
        <div style={{
            marginTop: '16px',
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '16px',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{
                    fontSize: '13px', fontWeight: '700', color: 'var(--foreground)',
                    margin: 0, display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                    <Clock size={14} color="var(--text-muted)" />
                    Son başlıklar
                </h3>
                <Link href="/forum" style={{
                    fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500',
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px',
                }}>
                    tümü <ChevronRight size={11} />
                </Link>
            </div>

            {threads.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0', margin: 0 }}>Henüz başlık yok</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {threads.map((thread, index) => (
                        <Link key={thread.id} href={getThreadSlugUrl(thread)} style={{ textDecoration: 'none' }}>
                            <div
                                style={{
                                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                                    padding: '9px 6px',
                                    borderBottom: index < threads.length - 1 ? '1px solid var(--card-border)' : 'none',
                                    transition: 'background 0.15s',
                                    borderRadius: '4px',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <span style={{
                                        color: 'var(--foreground)', fontSize: '12.5px',
                                        fontWeight: '500', lineHeight: 1.45,
                                        display: '-webkit-box', WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                    }}>
                                        {thread.title}
                                    </span>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        marginTop: '3px', fontSize: '10.5px', color: 'var(--text-muted)',
                                    }}>
                                        <span style={{ fontWeight: '500' }}>{thread.category}</span>
                                        <span style={{ opacity: 0.4 }}>·</span>
                                        <span>@{thread.authorUsername}</span>
                                        <span style={{ marginLeft: 'auto', opacity: 0.6 }}>
                                            {getRelativeTime(thread)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
