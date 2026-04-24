import { db } from "./firebase";
import { collection, doc, getDoc, setDoc, updateDoc, addDoc, query, where, getDocs, serverTimestamp, increment } from "firebase/firestore";

// Submit an anonymous rating for a user
export async function rateUser(targetUserId: string, targetUsername: string, raterId: string, score: number) {
    if (!targetUserId || !raterId || score < 1 || score > 5) return { success: false, message: "Geçersiz parametreler." };
    if (targetUserId === raterId) return { success: false, message: "Kendinize puan veremezsiniz." };

    try {
        const ratingsRef = collection(db, "userRatings");
        // Check if already rated
        const q = query(ratingsRef, where("targetUserId", "==", targetUserId), where("raterId", "==", raterId));
        const snap = await getDocs(q);

        if (!snap.empty) {
            // Update existing rating
            const ratingDoc = snap.docs[0];
            const oldScore = ratingDoc.data().score;
            await updateDoc(doc(db, "userRatings", ratingDoc.id), {
                score,
                updatedAt: serverTimestamp()
            });

            // Update user aggregates
            const userRef = doc(db, "users", targetUserId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                const totalScore = (data.ratingTotalScore || 0) - oldScore + score;
                const count = data.ratingCount || 1;
                await updateDoc(userRef, {
                    ratingTotalScore: totalScore,
                    ratingAverage: totalScore / count
                });
            }
            return { success: true, message: "Puanınız güncellendi." };
        } else {
            // New rating
            await addDoc(ratingsRef, {
                targetUserId,
                targetUsername,
                raterId, // Stored to prevent duplicate votes, but not publicly exposed
                score,
                createdAt: serverTimestamp()
            });

            // Update user aggregates
            const userRef = doc(db, "users", targetUserId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                const totalScore = (data.ratingTotalScore || 0) + score;
                const count = (data.ratingCount || 0) + 1;
                await updateDoc(userRef, {
                    ratingTotalScore: totalScore,
                    ratingCount: count,
                    ratingAverage: totalScore / count
                });
            }
            return { success: true, message: "Puan verildi." };
        }
    } catch (error) {
        console.error("Error rating user:", error);
        throw error;
    }
}

// Get user's rating
export async function getUserRating(userId: string) {
    if (!userId) return { average: 0, count: 0 };
    try {
        const userRef = doc(db, "users", userId);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
            const data = snap.data();
            return {
                average: data.ratingAverage || 0,
                count: data.ratingCount || 0
            };
        }
        return { average: 0, count: 0 };
    } catch (error) {
        console.error("Error fetching rating:", error);
        return { average: 0, count: 0 };
    }
}
