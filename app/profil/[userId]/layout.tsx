import { notFound } from 'next/navigation';
import { findPublicContentDocument } from '@/lib/public-content-server';

export default async function PublicProfileLayout({ children, params }: {
    children: React.ReactNode;
    params: Promise<{ userId: string }>;
}) {
    const { userId } = await params;
    if (!await findPublicContentDocument('users', 'username', userId)) notFound();
    return children;
}
