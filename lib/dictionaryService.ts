import { db } from "@/lib/firebase";
import {
    collection, addDoc, updateDoc, deleteDoc, doc,
    onSnapshot, query, orderBy, serverTimestamp, getDocs,
    type Unsubscribe
} from "firebase/firestore";

export interface DictionaryTerm {
    id: string;
    term: string;
    description: string;
    why: string;
    category: string;
    letter: string;
}

const COLLECTION = "dictionary";

/** Tum terimleri dinle — hata olursa fallback olarak getDocs kullanir */
export function subscribeToTerms(
    callback: (terms: DictionaryTerm[]) => void,
    onError?: (error: Error) => void
): Unsubscribe {
    const col = collection(db, COLLECTION);

    // orderBy olmadan basit sorgu — index gerektirmez
    return onSnapshot(
        col,
        (snap) => {
            const terms = snap.docs.map(d => ({
                id: d.id,
                term: d.data().term || "",
                description: d.data().description || "",
                why: d.data().why || "",
                category: d.data().category || "Mekanik",
                letter: d.data().letter || "",
            }));
            // Client-side sort
            terms.sort((a, b) => a.term.localeCompare(b.term, 'tr'));
            callback(terms);
        },
        (error) => {
            console.error("Dictionary subscription error:", error);
            if (onError) onError(error);

            // Fallback: tek seferlik okuma dene
            getDocs(col)
                .then((snap) => {
                    const terms = snap.docs.map(d => ({
                        id: d.id,
                        term: d.data().term || "",
                        description: d.data().description || "",
                        why: d.data().why || "",
                        category: d.data().category || "Mekanik",
                        letter: d.data().letter || "",
                    }));
                    terms.sort((a, b) => a.term.localeCompare(b.term, 'tr'));
                    callback(terms);
                })
                .catch((e) => {
                    console.error("Dictionary fallback fetch also failed:", e);
                    // Return empty array so the UI at least shows "no results"
                    callback([]);
                });
        }
    );
}

/** Yeni terim ekle */
export async function addTerm(data: Omit<DictionaryTerm, "id">): Promise<string> {
    const ref = await addDoc(collection(db, COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
    });
    return ref.id;
}

/** Terim guncelle */
export async function updateTerm(id: string, data: Partial<DictionaryTerm>): Promise<void> {
    const { id: _, ...rest } = data as any;
    await updateDoc(doc(db, COLLECTION, id), rest);
}

/** Terim sil */
export async function deleteTerm(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
}
