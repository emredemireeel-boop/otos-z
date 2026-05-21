"use client";

import { useState, useEffect } from "react";
import { getLeaderboard, LeaderboardEntry, getLevelForXP } from "@/lib/xpService";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

export default function Leaderboard() {
    const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            const data = await getLeaderboard(timeframe, 10);
            setEntries(data);
            setLoading(false);
        };
        fetchLeaderboard();
    }, [timeframe]);

    const userEntry = entries.find(e => e.id === user?.id);

    return (
        <div className="leaderboard-card">
            <h3 className="leaderboard-title">Liderlik Tablosu 🏆</h3>
            
            <div className="timeframe-tabs">
                <button 
                    className={`tab-btn ${timeframe === 'weekly' ? 'active' : ''}`}
                    onClick={() => setTimeframe('weekly')}
                >
                    Haftalık
                </button>
                <button 
                    className={`tab-btn ${timeframe === 'monthly' ? 'active' : ''}`}
                    onClick={() => setTimeframe('monthly')}
                >
                    Aylık
                </button>
                <button 
                    className={`tab-btn ${timeframe === 'alltime' ? 'active' : ''}`}
                    onClick={() => setTimeframe('alltime')}
                >
                    Tümü
                </button>
            </div>
            
            <div className="reset-notice">
                Haftalık yarışma Pazar gecesi sıfırlanır. Birinci ol!
            </div>

            <div className="entries-list">
                {loading ? (
                    <div className="loading-state">Yükleniyor...</div>
                ) : entries.length === 0 ? (
                    <div className="empty-state">Henüz kimse yok.</div>
                ) : (
                    entries.map((entry) => {
                        const levelInfo = getLevelForXP(entry.xp);
                        const isTop1 = entry.rank === 1;
                        const isTop2 = entry.rank === 2;
                        const isTop3 = entry.rank === 3;
                        
                        return (
                            <div key={entry.id} className={`entry-row ${entry.id === user?.id ? 'is-me' : ''} rank-${entry.rank}`}>
                                <div className="rank">
                                    {isTop1 ? '👑' : entry.rank}
                                </div>
                                <div className="avatar">
                                    {entry.photoURL ? (
                                        <Image src={entry.photoURL} alt={entry.username} width={32} height={32} style={{borderRadius:'50%'}}/>
                                    ) : (
                                        entry.username.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="user-info">
                                    <div className="username">{entry.username}</div>
                                    <div className="level-badge" style={{color: levelInfo.color}}>
                                        {levelInfo.icon} {levelInfo.name}
                                    </div>
                                </div>
                                <div className="xp-score">{entry.xp} XP</div>
                            </div>
                        );
                    })
                )}
            </div>

            {user && !userEntry && !loading && (
                <div className="my-rank-info">
                    Senin XP'n: {user.xp || 0}
                </div>
            )}

            <Link href="/liderlik" className="view-all-link">
                Tüm Listeyi Gör
            </Link>

            <style jsx>{`
                .leaderboard-card {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 16px;
                    padding: 20px;
                    box-shadow: var(--card-shadow);
                }

                .leaderboard-title {
                    font-size: 18px;
                    font-weight: 800;
                    margin: 0 0 16px 0;
                    color: var(--foreground);
                }

                .timeframe-tabs {
                    display: flex;
                    gap: 4px;
                    background: var(--secondary);
                    padding: 4px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                }

                .tab-btn {
                    flex: 1;
                    background: transparent;
                    border: none;
                    padding: 6px 0;
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--text-muted);
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .tab-btn.active {
                    background: var(--card-bg);
                    color: var(--foreground);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .reset-notice {
                    font-size: 11px;
                    color: var(--primary);
                    text-align: center;
                    margin-bottom: 12px;
                    font-weight: 600;
                    opacity: 0.8;
                }

                .entries-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 16px;
                }

                .entry-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 12px;
                    border-radius: 8px;
                    background: var(--secondary);
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }

                .entry-row:hover {
                    background: var(--hover-primary);
                }

                .entry-row.is-me {
                    border-color: var(--primary);
                    background: rgba(0, 90, 226, 0.05);
                }

                .entry-row.rank-1 { border-color: #ffd700; box-shadow: 0 0 10px rgba(255,215,0,0.2); }
                .entry-row.rank-2 { border-color: #c0c0c0; }
                .entry-row.rank-3 { border-color: #cd7f32; }

                .rank {
                    font-weight: 800;
                    font-size: 14px;
                    color: var(--text-muted);
                    width: 24px;
                    text-align: center;
                }

                .avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: var(--primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 14px;
                    flex-shrink: 0;
                }

                .user-info {
                    flex: 1;
                    min-width: 0;
                }

                .username {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--foreground);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .level-badge {
                    font-size: 11px;
                    font-weight: 600;
                    margin-top: 2px;
                }

                .xp-score {
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--primary);
                }

                .loading-state, .empty-state {
                    padding: 20px;
                    text-align: center;
                    color: var(--text-muted);
                    font-size: 13px;
                }

                .my-rank-info {
                    padding: 12px;
                    background: rgba(0, 90, 226, 0.1);
                    border-radius: 8px;
                    text-align: center;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--primary);
                    margin-bottom: 12px;
                }

                .view-all-link {
                    display: block;
                    text-align: center;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--primary);
                    text-decoration: none;
                }
                
                .view-all-link:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}
