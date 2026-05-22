"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { subscribeToThreads, type ForumThread } from "@/lib/forumService";
import { Clock } from "lucide-react";

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

    return (
        <div style={{
            marginTop: '16px',
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '12px',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Clock size={14} color="var(--primary)" />
                <h3 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--foreground)' }}>
                    Son Açılan Başlıklar
                </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {threads.length === 0 ? (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>Henüz başlık yok</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {threads.map((thread) => (
                            <li key={thread.id}>
                                <Link
                                    href={`/forum/${thread.id}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '8px',
                                        padding: '8px 6px',
                                        borderRadius: '6px',
                                        textDecoration: 'none',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <span style={{ 
                                            color: 'var(--foreground)', 
                                            fontSize: '12px', 
                                            fontWeight: '500', 
                                            lineHeight: 1.4, 
                                            display: 'block',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {thread.title}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>@{thread.authorUsername}</span>
                                            <span style={{ color: 'var(--primary)', fontSize: '10px', fontWeight: '500' }}>{thread.category}</span>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
