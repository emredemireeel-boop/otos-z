import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment, collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

export const XP_ACTIONS = {
    WRITE_ENTRY: 10,
    RECEIVE_LIKE: 5,
    CREATE_SURVEY: 15,
    DAILY_LOGIN: 5,
    DAILY_CONTENT: 10,
    STREAK_BONUS_7: 50,
    STREAK_BONUS_30: 200,
    STREAK_BONUS_100: 500,
    INVITE_FRIEND: 100,
    COMPLETE_PROFILE: 20,
    FIRST_ENTRY: 25,
    CREATE_THREAD: 15,
    VOTE_SURVEY: 5,
    ADD_VEHICLE_DNA: 20,
    EXPERT_ANSWER: 30
};

export interface Level {
    name: string;
    minXP: number;
    icon: string;
    color: string;
}

export const LEVELS: Level[] = [
    { name: 'Çaylak', minXP: 0, icon: '🌱', color: '#888888' },
    { name: 'Sürücü', minXP: 100, icon: '🚗', color: '#3b82f6' },
    { name: 'Tutkun', minXP: 500, icon: '💜', color: '#a855f7' },
    { name: 'Mekanik', minXP: 1500, icon: '🔧', color: '#f59e0b' },
    { name: 'Usta', minXP: 5000, icon: '⭐', color: '#22c55e' },
    { name: 'Uzman', minXP: 15000, icon: '🏆', color: '#ef4444' },
    { name: 'Efsane', minXP: 50000, icon: '👑', color: '#ffd700' },
    { name: 'Elçi', minXP: 100000, icon: '🌟', color: '#00d4ff' }
];

export function getLevelForXP(xp: number): Level {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (xp >= LEVELS[i].minXP) {
            return LEVELS[i];
        }
    }
    return LEVELS[0];
}

export function getNextLevel(xp: number): Level | null {
    for (let i = 0; i < LEVELS.length; i++) {
        if (xp < LEVELS[i].minXP) {
            return LEVELS[i];
        }
    }
    return null;
}

export function getXPProgress(xp: number) {
    const currentLevel = getLevelForXP(xp);
    const nextLevel = getNextLevel(xp);
    
    if (!nextLevel) {
        return { current: xp, required: currentLevel.minXP, percentage: 100 };
    }
    
    const xpInCurrentLevel = xp - currentLevel.minXP;
    const xpRequiredForNextLevel = nextLevel.minXP - currentLevel.minXP;
    const percentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForNextLevel) * 100));
    
    return {
        current: xp,
        required: nextLevel.minXP,
        percentage
    };
}

export interface XPResult {
    newXP: number;
    xpGained: number;
    leveledUp: boolean;
    newLevel: Level | null;
    oldLevel: Level;
}

export async function awardXP(userId: string, action: keyof typeof XP_ACTIONS, customAmount?: number): Promise<XPResult | null> {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) return null;
        
        const userData = userSnap.data();
        const currentXP = userData.xp || 0;
        const xpGained = customAmount || XP_ACTIONS[action];
        const newXP = currentXP + xpGained;
        
        const oldLevel = getLevelForXP(currentXP);
        const newLevel = getLevelForXP(newXP);
        const leveledUp = oldLevel.name !== newLevel.name;
        
        await updateDoc(userRef, {
            xp: increment(xpGained),
            level: newLevel.name
        });
        
        if (leveledUp) {
            await addDoc(collection(db, "notifications"), {
                userId,
                type: 'achievement',
                title: 'Seviye Atladın!',
                message: `Tebrikler! ${newLevel.name} seviyesine ulaştın.`,
                createdAt: serverTimestamp(),
                read: false
            });
        }
        
        return {
            newXP,
            xpGained,
            leveledUp,
            newLevel: leveledUp ? newLevel : null,
            oldLevel
        };
    } catch (error) {
        console.error("Error awarding XP:", error);
        return null;
    }
}

export async function updateDailyContentStreak(userId: string): Promise<{ xpGained: number, currentStreak: number, isNewDay: boolean } | null> {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) return null;
        
        const userData = userSnap.data();
        const lastContentDate = userData.lastContentDate?.toDate ? userData.lastContentDate.toDate() : null;
        const now = new Date();
        const todayStr = now.toDateString();
        
        let currentStreak = userData.streak || 0;
        let isNewDay = false;
        let totalXpGained = 0;
        
        if (!lastContentDate || lastContentDate.toDateString() !== todayStr) {
            isNewDay = true;
            
            // Check if streak continues (was logged in yesterday)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastContentDate && lastContentDate.toDateString() === yesterday.toDateString()) {
                currentStreak += 1;
            } else if (!lastContentDate || lastContentDate.toDateString() !== todayStr) {
                // If it's not today and not yesterday, streak resets to 1
                currentStreak = 1;
            }
            
            // Award daily content XP
            const result = await awardXP(userId, 'DAILY_CONTENT');
            if (result) totalXpGained += result.xpGained;
            
            // Streak bonuses
            if (currentStreak === 7) {
                const bonusResult = await awardXP(userId, 'STREAK_BONUS_7');
                if (bonusResult) totalXpGained += bonusResult.xpGained;
            } else if (currentStreak === 30) {
                const bonusResult = await awardXP(userId, 'STREAK_BONUS_30');
                if (bonusResult) totalXpGained += bonusResult.xpGained;
            } else if (currentStreak === 100) {
                const bonusResult = await awardXP(userId, 'STREAK_BONUS_100');
                if (bonusResult) totalXpGained += bonusResult.xpGained;
            }
            
            await updateDoc(userRef, {
                lastContentDate: serverTimestamp(),
                streak: currentStreak
            });
        }
        
        return {
            xpGained: totalXpGained,
            currentStreak,
            isNewDay
        };
    } catch (error) {
        console.error("Error checking daily login:", error);
        return null;
    }
}

export interface LeaderboardEntry {
    rank: number;
    username: string;
    xp: number;
    level: string;
    photoURL?: string;
    id: string;
}

export async function getLeaderboard(timeframe: 'weekly' | 'monthly' | 'alltime', limitCount: number = 20): Promise<LeaderboardEntry[]> {
    try {
        let orderByField = 'xp';
        if (timeframe === 'weekly') orderByField = 'weeklyXP';
        else if (timeframe === 'monthly') orderByField = 'monthlyXP';
        
        const q = query(collection(db, "users"), orderBy(orderByField, "desc"), limit(limitCount));
        const snap = await getDocs(q);
        
        const leaderboard: LeaderboardEntry[] = [];
        let rank = 1;
        
        snap.forEach(doc => {
            const data = doc.data();
            leaderboard.push({
                rank: rank++,
                id: doc.id,
                username: data.username || data.displayName || 'Kullanıcı',
                xp: data[orderByField] || 0,
                level: data.level || 'Çaylak',
                photoURL: data.photoURL
            });
        });
        
        return leaderboard;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
}
