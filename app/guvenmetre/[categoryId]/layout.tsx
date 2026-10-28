import { notFound } from 'next/navigation';
import { categories } from '@/data/guvenmetre';

export default async function TrustCategoryLayout({ children, params }: {
    children: React.ReactNode;
    params: Promise<{ categoryId: string }>;
}) {
    const { categoryId } = await params;
    if (!categories.some(category => category.id === categoryId)) notFound();
    return children;
}
