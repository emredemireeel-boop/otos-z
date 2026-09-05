"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import XPPopup from "./XPPopup";
import MobileBottomNav from "./MobileBottomNav";
import { useAuth } from "@/context/AuthContext";
const PushNotificationManager = dynamic(() => import("./PushNotificationManager"), { ssr: false });

export default function GlobalEngagement() {
    const { firebaseUser } = useAuth();
    const [xpPopup, setXpPopup] = useState<{show: boolean, amount: number, action: string, leveledUp?: boolean, newLevelName?: string, newLevelIcon?: string} | null>(null);
    const [pushReady, setPushReady] = useState(false);
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

    useEffect(() => {
        const timer = window.setTimeout(() => setPushReady(true), 6000);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!firebaseUser) return;
        const key = `achievement-check:${firebaseUser.uid}`;
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, '1');
        void firebaseUser.getIdToken().then(token => fetch('/api/gamification/evaluate', { method:'POST', headers:{ Authorization: `Bearer ${token}` } })).catch(() => {});
    }, [firebaseUser]);

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
            
            
            
            {pushReady && <PushNotificationManager />}
            <MobileBottomNav />
        </>
    );
}
