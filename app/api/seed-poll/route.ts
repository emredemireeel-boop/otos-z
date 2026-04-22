import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function GET() {
    try {
        const docRef = await addDoc(collection(db, "surveys"), {
            title: "Benzin mi, Dizel mi, Elektrik mi?",
            description: "Yeni nesil otomotiv dünyasında tercihiniz hangi motor tipinden yana? Performans, ekonomi ve gelecek vizyonu açısından en doğru seçim hangisi?",
            category: "Genel",
            iconName: "none",
            status: "active",
            totalVotes: 0,
            nominees: [
                { id: 1, name: "Benzin", votes: 0 },
                { id: 2, name: "Dizel", votes: 0 },
                { id: 3, name: "Elektrik", votes: 0 }
            ],
            voters: {},
            createdBy: "admin",
            createdAt: serverTimestamp(),
        });
        return NextResponse.json({ success: true, id: docRef.id });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message });
    }
}
