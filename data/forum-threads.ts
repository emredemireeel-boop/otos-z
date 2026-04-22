// Forum veri tipleri - Firestore'dan gelen veriler icin kullanilir
// Demo veriler kaldirildi - gercek veri Firestore'dan gelir

export interface ForumEntry {
    id: string;
    authorId: string;
    username: string;
    content: string;
    createdAt: string | null;
    likes: number;
    likedBy: string[];
}

export interface ForumThread {
    id: string;
    title: string;
    category: string;
    authorId: string;
    authorUsername: string;
    createdAt: string | null;
    views: number;
    tags: string[];
    entryCount: number;
    lastEntryAt: string | null;
}

// Bos array - eski kodun kirilmamasini saglar
export const forumThreads: ForumThread[] = [];

// Helper - eski kodun kirilmamasini saglar
export const getThreadById = (id: string): ForumThread | undefined => {
    return undefined;
};

export const getThreadsByCategory = (category: string): ForumThread[] => {
    return [];
};

export const getForumCategories = (): string[] => {
    return ["Genel", "Teknik", "Deneyim", "Karsilastirma", "Marka", "Alim-Satim"];
};
