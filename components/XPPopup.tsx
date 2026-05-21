"use client";

import { useEffect, useState } from "react";

export interface XPPopupProps {
    xpAmount: number;
    action: string;
    leveledUp?: boolean;
    newLevelName?: string;
    newLevelIcon?: string;
    onClose: () => void;
}

export default function XPPopup({ xpAmount, action, leveledUp, newLevelName, newLevelIcon, onClose }: XPPopupProps) {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsClosing(true);
            setTimeout(onClose, 500); // Wait for fadeOut animation
        }, leveledUp ? 5000 : 3000);

        return () => clearTimeout(timer);
    }, [leveledUp, onClose]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 500);
    };

    return (
        <div className={`xp-popup-container ${isClosing ? 'closing' : ''} ${leveledUp ? 'level-up' : ''}`}>
            {leveledUp && (
                <div className="confetti-container">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="confetti" style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 0.5}s`,
                            backgroundColor: ['#f59e0b', '#3b82f6', '#22c55e', '#ef4444', '#a855f7'][Math.floor(Math.random() * 5)]
                        }}></div>
                    ))}
                </div>
            )}
            
            <button className="close-btn" onClick={handleClose}>×</button>
            
            {leveledUp ? (
                <>
                    <h3 className="level-up-title">SEVİYE ATLADIN! 🎉</h3>
                    <div className="level-info">
                        <span className="level-icon">{newLevelIcon}</span>
                        <span className="level-name">{newLevelName}</span>
                    </div>
                    <div className="xp-amount">+{xpAmount} XP</div>
                    <div className="action-text">{action}</div>
                </>
            ) : (
                <>
                    <div className="xp-amount">+{xpAmount} XP</div>
                    <div className="action-text">{action}</div>
                </>
            )}

            <style jsx>{`
                .xp-popup-container {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 9999;
                    background: var(--card-bg);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--primary);
                    border-radius: 16px;
                    padding: 20px;
                    min-width: 280px;
                    box-shadow: 0 4px 20px var(--primary-glow);
                    animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    text-align: center;
                    overflow: hidden;
                }
                
                .xp-popup-container.level-up {
                    min-width: 320px;
                    border-color: #ffd700;
                    box-shadow: 0 4px 30px rgba(255, 215, 0, 0.3);
                }

                .xp-popup-container.closing {
                    animation: fadeOut 0.5s ease forwards;
                }

                .close-btn {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: 20px;
                    cursor: pointer;
                    line-height: 1;
                    padding: 4px;
                }

                .close-btn:hover {
                    color: var(--foreground);
                }

                .xp-amount {
                    font-size: 32px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #22c55e, #10b981);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 4px;
                }

                .level-up .xp-amount {
                    font-size: 24px;
                    background: linear-gradient(135deg, #ffd700, #f59e0b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-top: 12px;
                }

                .action-text {
                    font-size: 14px;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .level-up-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--foreground);
                    margin: 0 0 16px 0;
                    letter-spacing: 1px;
                }

                .level-info {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: 8px;
                }

                .level-icon {
                    font-size: 40px;
                    animation: bounce 1s infinite alternate;
                }

                .level-name {
                    font-size: 28px;
                    font-weight: 800;
                    color: var(--foreground);
                }

                .confetti-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }

                .confetti {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    top: -10px;
                    border-radius: 50%;
                    animation: fall 3s linear forwards;
                }

                @keyframes slideUp {
                    from { transform: translateY(100px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @keyframes fadeOut {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(20px); opacity: 0; }
                }

                @keyframes bounce {
                    from { transform: translateY(0); }
                    to { transform: translateY(-10px); }
                }

                @keyframes fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(150px) rotate(360deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
}
