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
            padding: '16px',
            overflow: 'hidden'
        }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="var(--primary)" /> Son Açılan Başlıklar
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {threads.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>Henüz başlık yok</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {threads.map((thread) => (
                            <li key={thread.id}>
                                <Link
                                    href={`/forum/${thread.id}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '10px',
                                        padding: '10px 8px',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <span style={{ 
                                            color: 'var(--foreground)', 
                                            fontSize: '13px', 
                                            lineHeight: 1.4, 
                                            display: 'block'
                                        }}>
                                            {thread.title}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>@{thread.authorUsername}</span>
                                            <span style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: '500' }}>{thread.category}</span>
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
