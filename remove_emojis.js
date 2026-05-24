const admin = require('firebase-admin');

// Servis hesabınızı yükleyin (Projenize uygun path'i belirtin)
const serviceAccount = require('./otosoz-admin.json');

// Firebase Admin SDK'yı başlatın
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

function removeEmojis(text) {
    if (!text) return text;
    // Replace all emojis with an empty string
    return text.replace(/\p{Extended_Pictographic}/gu, '').replace(/\s+/g, ' ').trim();
}

async function cleanEmojis() {
    console.log("Starting emoji cleanup...");
    let updatedThreads = 0;
    
    try {
        const threadsRef = db.collection('threads');
        const snapshot = await threadsRef.get();

        for (const doc of snapshot.docs) {
            const data = doc.data();
            let needsUpdate = false;
            let newTitle = data.title;

            if (data.title) {
                const cleanTitle = removeEmojis(data.title);
                if (cleanTitle !== data.title) {
                    newTitle = cleanTitle;
                    needsUpdate = true;
                    console.log(`Thread ID: ${doc.id}`);
                    console.log(`Old Title: ${data.title}`);
                    console.log(`New Title: ${cleanTitle}`);
                }
            }

            if (needsUpdate) {
                await doc.ref.update({ title: newTitle });
                updatedThreads++;
                console.log(`Updated thread ${doc.id}`);
            }
            
            // Note: Not doing entries to save DB operations unless required,
            // but the user said "bir başlıkta emoji var onu sil". I will just clean thread titles to be safe.
        }

        console.log(`Finished. Updated ${updatedThreads} threads.`);
    } catch (error) {
        console.error("Error cleaning emojis:", error);
    }
}

cleanEmojis();
