import { db } from "@/lib/firebase";
import {
    collection, addDoc, updateDoc, deleteDoc, doc,
    onSnapshot, query, orderBy, serverTimestamp,
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

/** Tum terimleri dinle */
export function subscribeToTerms(callback: (terms: DictionaryTerm[]) => void): Unsubscribe {
    const q = query(collection(db, COLLECTION), orderBy("term"));
    return onSnapshot(q, (snap) => {
        const terms = snap.docs.map(d => ({
            id: d.id,
            term: d.data().term || "",
            description: d.data().description || "",
            why: d.data().why || "",
            category: d.data().category || "Mekanik",
            letter: d.data().letter || "",
        }));
        callback(terms);
    });
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
