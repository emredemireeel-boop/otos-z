import { indexabilityRobots, SUPPORTING_TEMPLATE_INDEXABLE } from '@/lib/indexability';
export const metadata = { robots: indexabilityRobots(SUPPORTING_TEMPLATE_INDEXABLE) };
import { notFound } from 'next/navigation';
import { getBrandsForCategory } from '@/data/guvenmetre';

export default async function TrustBrandLayout({ children, params }: {
    children: React.ReactNode;
    params: Promise<{ categoryId: string; brandId: string }>;
}) {
    const { categoryId, brandId } = await params;
    if (!getBrandsForCategory(categoryId).some(brand => brand.id === brandId)) notFound();
    return children;
}
