"use client";

import { useState, useEffect } from "react";

export interface DailyStreakModalProps {
    streak: number;
    xpGained: number;
    isVisible: boolean;
    onClose: () => void;
}

export default function DailyStreakModal({ streak, xpGained, isVisible, onClose }: DailyStreakModalProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShow(true);
        } else {
            const timer = setTimeout(() => setShow(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    if (!show && !isVisible) return null;

    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    // Logic to show checkmarks for current streak up to today.
    // For simplicity in UI, let's just light up the last N days where N = min(streak, 7)
    // and today is the Nth day.
    const activeDaysCount = Math.min(streak, 7);

    return (
        <div className={`streak-modal-overlay ${isVisible ? 'visible' : ''}`}>
            <div className="streak-modal">
                <div className="fire-emoji">🔥</div>
                <h2 className="streak-title">{streak} Gün İçerik Serisi!</h2>
                <p className="xp-text">Bugünün içeriğini ürettin, serini korudun! +{xpGained} XP</p>

                <div className="calendar-row">
                    {days.map((day, index) => {
                        const isActive = index < activeDaysCount;
                        const isToday = index === activeDaysCount - 1;
                        return (
                            <div key={day} className="day-col">
                                <div className={`day-circle ${isActive ? 'active' : ''} ${isToday ? 'today' : ''}`}>
                                    {isActive ? '✅' : '⬜'}
                                </div>
                                <span className="day-label">{day}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="milestones">
                    {streak < 7 && (
                        <div className="milestone-hint">
                            Hedefe {7 - streak} gün kaldı! (7. günde +50 XP)
                        </div>
                    )}
                    {streak >= 7 && streak < 30 && (
                        <div className="milestone-hint">
                            Hedefe {30 - streak} gün kaldı! (30. günde +200 XP)
                        </div>
                    )}
                </div>

                <button className="close-btn" onClick={onClose}>Harika!</button>
            </div>

            <style jsx>{`
                .streak-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: var(--overlay-bg);
                    backdrop-filter: blur(5px);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                }
                .streak-modal-overlay.visible {
                    opacity: 1;
                    pointer-events: auto;
                }

                .streak-modal {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: 24px;
                    padding: 32px;
                    width: 90%;
                    max-width: 400px;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    transform: translateY(20px);
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .streak-modal-overlay.visible .streak-modal {
                    transform: translateY(0);
                }

                .fire-emoji {
                    font-size: 64px;
                    animation: float 3s ease-in-out infinite;
                    margin-bottom: 16px;
                }

                .streak-title {
                    font-size: 28px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #f59e0b, #ef4444);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin: 0 0 8px 0;
                }

                .xp-text {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--success);
                    margin: 0 0 32px 0;
                    line-height: 1.4;
                }

                .calendar-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 32px;
                }

                .day-col {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }

                .day-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: var(--secondary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    transition: all 0.3s ease;
                }

                .day-circle.active {
                    background: rgba(34, 197, 94, 0.1);
                }

                .day-circle.today {
                    border: 2px solid var(--primary);
                    box-shadow: 0 0 15px var(--primary-glow);
                    transform: scale(1.1);
                }

                .day-label {
                    font-size: 12px;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .milestones {
                    margin-bottom: 32px;
                    padding: 16px;
                    background: var(--secondary);
                    border-radius: 12px;
                }

                .milestone-hint {
                    font-size: 14px;
                    color: var(--foreground);
                    font-weight: 600;
                }

                .close-btn {
                    width: 100%;
                    padding: 16px;
                    background: var(--primary);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .close-btn:hover {
                    background: var(--hover-primary);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px var(--primary-glow);
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
}
