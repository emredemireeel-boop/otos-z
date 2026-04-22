"use client";

import { useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { dictionaryTerms } from "@/data/dictionary";

/**
 * Bu sayfa sozluk verilerini Firestore'a aktarir.
 * Tek seferlik kullanilir — admin girisi gerekir.
 * URL: /admin/seed-dictionary
 */
export default function SeedDictionaryPage() {
    const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
    const [progress, setProgress] = useState(0);
    const [total] = useState(dictionaryTerms.length);
    const [message, setMessage] = useState("");

    const handleSeed = async () => {
        setStatus("running");
        setProgress(0);

        try {
            // Once mevcut kontrol
            const existing = await getDocs(collection(db, "dictionary"));
            if (existing.size > 0) {
                setMessage(`Firestore'da zaten ${existing.size} terim var. Islem iptal edildi.`);
                setStatus("done");
                return;
            }

            let count = 0;
            for (const term of dictionaryTerms) {
                await addDoc(collection(db, "dictionary"), {
                    term: term.term,
                    description: term.description,
                    why: term.why,
                    category: term.category,
                    letter: term.letter,
                    createdAt: serverTimestamp(),
                });
                count++;
                setProgress(count);
            }

            setMessage(`${count} terim basariyla Firestore'a aktarildi!`);
            setStatus("done");
        } catch (e) {
            console.error("Seed error:", e);
            setMessage("Hata olustu: " + (e as Error).message);
            setStatus("error");
        }
    };

    return (
        <div style={{ maxWidth: "600px" }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--foreground)', marginBottom: '16px' }}>
                Sozluk Verilerini Aktar
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '14px' }}>
                <code>data/dictionary.ts</code> dosyasindaki {total} terimi Firestore <code>dictionary</code> koleksiyonuna aktarir.
                <br />Bu islem sadece bir kere yapilmalidir.
            </p>

            {status === "idle" && (
                <button onClick={handleSeed} style={{
                    padding: '14px 28px', background: '#8B5CF6', color: 'white',
                    border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                }}>
                    {total} Terimi Firestore'a Aktar
                </button>
            )}

            {status === "running" && (
                <div>
                    <div style={{ height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                        <div style={{ width: `${(progress / total) * 100}%`, height: '100%', background: '#8B5CF6', transition: 'width 0.3s ease', borderRadius: '4px' }} />
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{progress} / {total} terim aktarildi...</p>
                </div>
            )}

            {(status === "done" || status === "error") && (
                <div style={{
                    padding: '16px 20px', borderRadius: '12px',
                    background: status === "done" ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${status === "done" ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    color: status === "done" ? '#10B981' : '#EF4444',
                    fontSize: '14px', fontWeight: '600',
                }}>
                    {message}
                </div>
            )}
        </div>
    );
}
