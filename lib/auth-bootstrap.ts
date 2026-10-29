export const AUTH_NEEDED_EVENT='otosoz:auth-needed';
export function needsAuthRoute(path:string):boolean {
    return /^\/(?:giris|kayit|profil|mesajlar|ayarlar|admin|moderator|bildirimler|profil-tamamla)(?:\/|$)/.test(path);
}

// Read persistence without downloading Firebase or creating a new database.
export async function hasPersistedAuth():Promise<boolean> {
    try {
        if(localStorage.getItem('Otosoz_user'))return true;
        for(const storage of [localStorage,sessionStorage])for(let i=0;i<storage.length;i++)if(storage.key(i)?.startsWith('firebase:authUser:')&&storage.getItem(storage.key(i)!)!=='null')return true;
        if(!globalThis.indexedDB)return false;
        if(typeof indexedDB.databases==='function'&&!(await indexedDB.databases()).some(db=>db.name==='firebaseLocalStorageDb'))return false;
        return await new Promise<boolean>(resolve=>{
            const request=indexedDB.open('firebaseLocalStorageDb');
            request.onupgradeneeded=()=>{request.transaction?.abort();resolve(false);};
            request.onerror=()=>resolve(false);
            request.onblocked=()=>resolve(false);
            request.onsuccess=()=>{
                const db=request.result;
                if(!db.objectStoreNames.contains('firebaseLocalStorage')){db.close();resolve(false);return;}
                const transaction=db.transaction('firebaseLocalStorage','readonly');
                const rows=transaction.objectStore('firebaseLocalStorage').getAll();
                rows.onsuccess=()=>resolve(rows.result.some(row=>String(row.fbase_key||'').startsWith('firebase:authUser:')&&row.value?.uid));
                rows.onerror=()=>resolve(false);
                transaction.oncomplete=()=>db.close();
            };
        });
    }catch{return false;}
}
