"use client";

import { useCallback, useEffect, useState } from "react";
import { browserLocalPersistence, setPersistence, signInWithCustomToken, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import styles from "./page.module.css";

function readPayload() {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const token = params.get("token") || "";
    const logout = params.get("logout") === "1";
    const requestedPath = params.get("next") || "/";
    const next = requestedPath.startsWith("/") && !requestedPath.startsWith("//") ? requestedPath : "/";
    return { token, logout, next };
}

export default function MobileLoginPage() {
    const [error, setError] = useState("");

    const connect = useCallback(async () => {
        const { token, logout, next } = readPayload();
        if (logout) {
            await signOut(auth).catch(() => undefined);
            window.history.replaceState(null, "", "/mobil-giris");
            window.location.replace(next);
            return;
        }
        if (!token) {
            await Promise.resolve();
            setError("Mobil oturum anahtarı bulunamadı.");
            return;
        }
        try {
            await setPersistence(auth, browserLocalPersistence);
            await signInWithCustomToken(auth, token);
            window.history.replaceState(null, "", "/mobil-giris");
            window.location.replace(next);
        } catch (caught) {
            console.error("Mobil oturum açılamadı:", caught);
            setError("Oturum eşitlenemedi. Uygulamaya dönüp yeniden deneyin.");
        }
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => { void connect(); }, 0);
        return () => window.clearTimeout(timer);
    }, [connect]);

    return (
        <main className={styles.page}>
            <section className={styles.card} aria-live="polite">
                <div className={styles.mark} aria-hidden="true">O</div>
                <h1 className={styles.title}>OtoSöz hesabın eşitleniyor</h1>
                <p className={styles.message}>{error || "Uygulamadaki hesabın bu modüle güvenli biçimde aktarılıyor."}</p>
                {error ? <button type="button" className={styles.retry} onClick={() => { setError(""); void connect(); }}>Tekrar dene</button> : <div className={styles.spinner} aria-label="Yükleniyor" />}
            </section>
        </main>
    );
}
