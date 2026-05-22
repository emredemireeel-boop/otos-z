import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, addDoc, collection, getDocs, query, orderBy, deleteDoc } from "firebase/firestore";

export interface DNAChronicIssue {
    id: string;
    text: string;
    author: string;
    authorId: string;
    votes: number;
    votedBy: string[];
    createdAt: number;
}

export interface VehicleDNAData {
    brandSlug: string;
    modelSlug: string;
    chronicIssues: DNAChronicIssue[];
    staticIssueVotes?: Record<string, string[]>;
}

const getVehicleDocId = (brandSlug: string, modelSlug: string) => `${brandSlug}_${modelSlug}`;

/** Get dynamic chronic issues for a specific vehicle */
export async function getVehicleChronicIssues(brandSlug: string, modelSlug: string): Promise<DNAChronicIssue[]> {
    const docId = getVehicleDocId(brandSlug, modelSlug);
    const docRef = doc(db, "vehicle_chronic_issues", docId);
    try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            return snap.data().chronicIssues || [];
        }
    } catch (e) {
        console.error("Error fetching vehicle chronic issues:", e);
    }
    return [];
}

/** Add a new chronic issue for a vehicle */
export async function addVehicleChronicIssue(brandSlug: string, modelSlug: string, data: {
    text: string;
    authorId: string;
    username: string;
}): Promise<DNAChronicIssue | null> {
    const docId = getVehicleDocId(brandSlug, modelSlug);
    const docRef = doc(db, "vehicle_chronic_issues", docId);
    
    const newIssue: DNAChronicIssue = {
        id: `vci_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        text: data.text.slice(0, 200),
        author: data.username.slice(0, 30),
        authorId: data.authorId,
        votes: 1,
        votedBy: [data.authorId],
        createdAt: Date.now(),
    };

    try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            const issues = snap.data().chronicIssues || [];
            if (issues.length >= 10) {
                console.warn("Max 10 issues reached");
                return null;
            }
            await updateDoc(docRef, {
                chronicIssues: [...issues, newIssue]
            });
        } else {
            await setDoc(docRef, {
                brandSlug,
                modelSlug,
                chronicIssues: [newIssue]
            });
        }
        return newIssue;
    } catch (e) {
        console.error("Error adding vehicle chronic issue:", e);
        return null;
    }
}

/** Toggle "Ben de yasadim" vote for a vehicle chronic issue */
export async function toggleVehicleChronicVote(brandSlug: string, modelSlug: string, issueId: string, userId: string): Promise<boolean> {
    const docId = getVehicleDocId(brandSlug, modelSlug);
    const docRef = doc(db, "vehicle_chronic_issues", docId);
    
    try {
        const snap = await getDoc(docRef);
        if (!snap.exists()) return false;

        const issues: DNAChronicIssue[] = snap.data().chronicIssues || [];
        let toggled = false;
        
        const updated = issues.map(issue => {
            if (issue.id !== issueId) return issue;
            const hasVoted = issue.votedBy.includes(userId);
            toggled = true;
            return {
                ...issue,
                votes: hasVoted ? issue.votes - 1 : issue.votes + 1,
                votedBy: hasVoted ? issue.votedBy.filter(id => id !== userId) : [...issue.votedBy, userId]
            };
        });

        if (toggled) {
            await updateDoc(docRef, { chronicIssues: updated });
            return true;
        }
    } catch (e) {
        console.error("Error toggling vehicle chronic issue vote:", e);
    }
    return false;
}

/** Get static issue votes for a specific vehicle */
export async function getVehicleStaticVotes(brandSlug: string, modelSlug: string): Promise<Record<string, string[]>> {
    const docId = getVehicleDocId(brandSlug, modelSlug);
    const docRef = doc(db, "vehicle_chronic_issues", docId);
    try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            return snap.data().staticIssueVotes || {};
        }
    } catch (e) {
        console.error("Error fetching vehicle static votes:", e);
    }
    return {};
}

/** Toggle "Ben de yasadim" vote for a STATIC vehicle chronic issue */
export async function toggleVehicleStaticVote(brandSlug: string, modelSlug: string, issueId: string, userId: string): Promise<boolean> {
    const docId = getVehicleDocId(brandSlug, modelSlug);
    const docRef = doc(db, "vehicle_chronic_issues", docId);
    
    try {
        const snap = await getDoc(docRef);
        let staticIssueVotes: Record<string, string[]> = {};
        
        if (snap.exists()) {
            staticIssueVotes = snap.data().staticIssueVotes || {};
        }

        const voters = staticIssueVotes[issueId] || [];
        const hasVoted = voters.includes(userId);
        
        const newVoters = hasVoted ? voters.filter(id => id !== userId) : [...voters, userId];
        staticIssueVotes[issueId] = newVoters;

        if (snap.exists()) {
            await updateDoc(docRef, { staticIssueVotes });
        } else {
            await setDoc(docRef, {
                brandSlug,
                modelSlug,
                chronicIssues: [],
                staticIssueVotes
            });
        }
        return true;
    } catch (e) {
        console.error("Error toggling static vehicle chronic issue vote:", e);
    }
    return false;
}

/** DNA Kronik Sorun Bildirimi Tipi */
export interface DNAChronicReport {
    id: string;
    brandSlug: string;
    modelSlug: string;
    brandName: string;
    modelName: string;
    engineName: string;
    issueTitle: string;
    issueDescription: string;
    severity: 'low' | 'medium' | 'high';
    username: string;
    userId: string;
    status: 'bekliyor' | 'onaylandi' | 'reddedildi';
    createdAt: number;
}

/** Kullanıcıdan gelen kronik sorun bildirimini admin onay kuyruğuna ekler */
export async function submitDNAChronicReport(data: {
    brandSlug: string;
    modelSlug: string;
    brandName: string;
    modelName: string;
    engineName: string;
    issueTitle: string;
    issueDescription: string;
    severity: 'low' | 'medium' | 'high';
    username: string;
    userId: string;
}): Promise<boolean> {
    try {
        await addDoc(collection(db, "dna_chronic_reports"), {
            ...data,
            status: 'bekliyor',
            createdAt: Date.now(),
        });
        return true;
    } catch (e) {
        console.error("Error submitting DNA chronic report:", e);
        return false;
    }
}

/** Admin: Tüm DNA kronik sorun bildirimlerini getir */
export async function getDNAChronicReports(): Promise<DNAChronicReport[]> {
    try {
        const q = query(collection(db, "dna_chronic_reports"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as DNAChronicReport));
    } catch (e) {
        console.error("Error fetching DNA chronic reports:", e);
        return [];
    }
}

/** Admin: DNA kronik sorun bildiriminin durumunu günceller */
export async function updateDNAChronicReportStatus(reportId: string, status: 'onaylandi' | 'reddedildi'): Promise<boolean> {
    try {
        await updateDoc(doc(db, "dna_chronic_reports", reportId), { status });
        return true;
    } catch (e) {
        console.error("Error updating DNA chronic report status:", e);
        return false;
    }
}

/** Admin: DNA kronik sorun bildirimini siler */
export async function deleteDNAChronicReport(reportId: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, "dna_chronic_reports", reportId));
        return true;
    } catch (e) {
        console.error("Error deleting DNA chronic report:", e);
        return false;
    }
}
