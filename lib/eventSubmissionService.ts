import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';

export type EventSubmissionType = 'NEW_EVENT' | 'UPDATE_EVENT';
export type EventSubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface EventSubmission {
    id?: string;
    type: EventSubmissionType;
    status: EventSubmissionStatus;
    submittedAt?: Timestamp;
    userId?: string; 
    
    // For NEW_EVENT
    eventName?: string;
    city?: string;
    district?: string;
    address?: string; // Zorunlu
    daysOpen?: string;
    isOneTimeEvent?: boolean;
    eventDate?: string;
    price?: string;
    organizer?: string; // Can be 'Bilinmiyor'
    
    // For UPDATE_EVENT
    eventId?: string; // ID of the existing event
    eventTitle?: string; // Title of the existing event
    updateMessage?: string; // The user's message/update info
}

export const eventSubmissionsCollection = collection(db, 'event_submissions');

export async function submitNewEvent(data: Partial<EventSubmission>) {
    return await addDoc(eventSubmissionsCollection, {
        ...data,
        type: 'NEW_EVENT',
        status: 'PENDING',
        submittedAt: serverTimestamp()
    });
}

export async function submitEventUpdate(data: Partial<EventSubmission>) {
    return await addDoc(eventSubmissionsCollection, {
        ...data,
        type: 'UPDATE_EVENT',
        status: 'PENDING',
        submittedAt: serverTimestamp()
    });
}

export async function getPendingSubmissions() {
    const q = query(
        eventSubmissionsCollection, 
        where('status', '==', 'PENDING'),
        orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventSubmission));
}

export async function updateSubmissionStatus(submissionId: string, status: EventSubmissionStatus) {
    const submissionRef = doc(db, 'event_submissions', submissionId);
    return await updateDoc(submissionRef, { status });
}
