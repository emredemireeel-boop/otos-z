import 'server-only';
import { getAdminDb, initError } from './firebaseAdmin';
import { runPublicFirestoreQuery } from './forumPublicServer';
import { communitySurvey } from './community';

/** Only genuine, visible Firestore polls; no editorial votes or fallback examples. */
export async function getCommunitySurveys() {
    let documents: { id: string; data: Record<string, any> }[];
    try {
        if (initError) throw initError;
        const snapshot = await getAdminDb().collection('surveys').orderBy('createdAt', 'desc').limit(200).get();
        documents = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
    } catch {
        documents = await runPublicFirestoreQuery({ collectionId: 'surveys', limit: 200, orderBy: { field: 'createdAt', direction: 'DESCENDING' } });
    }
    return documents.map(doc => communitySurvey(doc.id, doc.data)).filter((poll): poll is NonNullable<typeof poll> => poll !== null);
}
