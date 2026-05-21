"use client";

import { useState, useEffect } from "react";
import XPPopup from "./XPPopup";
import DailyStreakModal from "./DailyStreakModal";
import MobileBottomNav from "./MobileBottomNav";

export default function GlobalEngagement() {
    const [xpPopup, setXpPopup] = useState<{show: boolean, amount: number, action: string, leveledUp?: boolean, newLevelName?: string, newLevelIcon?: string} | null>(null);
    const [streakModal, setStreakModal] = useState<{show: boolean, streak: number, xpGained: number} | null>(null);

    useEffect(() => {
        const handleXpGained = (e: any) => {
            setXpPopup({
                show: true,
                amount: e.detail.xpAmount,
                action: e.detail.action,
                leveledUp: e.detail.leveledUp,
                newLevelName: e.detail.newLevelName,
                newLevelIcon: e.detail.newLevelIcon
            });
        };

        const handleDailyLogin = (e: any) => {
            setStreakModal({
                show: true,
                streak: e.detail.streak,
                xpGained: e.detail.xpGained
            });
        };

        window.addEventListener('xp_gained', handleXpGained);
        window.addEventListener('daily_login_reward', handleDailyLogin);

        return () => {
            window.removeEventListener('xp_gained', handleXpGained);
            window.removeEventListener('daily_login_reward', handleDailyLogin);
        };
    }, []);

    return (
        <>
            {xpPopup?.show && (
                <XPPopup
                    xpAmount={xpPopup.amount}
                    action={xpPopup.action}
                    leveledUp={xpPopup.leveledUp}
                    newLevelName={xpPopup.newLevelName}
                    newLevelIcon={xpPopup.newLevelIcon}
                    onClose={() => setXpPopup(null)}
                />
            )}
            
            <DailyStreakModal
                isVisible={streakModal?.show || false}
                streak={streakModal?.streak || 0}
                xpGained={streakModal?.xpGained || 0}
                onClose={() => setStreakModal(null)}
            />
            
            <MobileBottomNav />
        </>
    );
}
