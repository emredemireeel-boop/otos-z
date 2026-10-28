import { notFound } from 'next/navigation';
import { createSlug } from '@/data/vehicle-dna';
import { engineDNAData } from '@/data/engine-dna';
import { findVehicleByRoute } from '@/lib/aracDnaSeo';
import { isVehicleIndexable } from '@/lib/indexability';
import { buildVehicleFaq } from '@/lib/vehicleFaq';
import ModelOverviewClient from './ModelOverviewClient';

export default async function VehicleModelPage({ params }: { params: Promise<{ brand: string; model: string }> }) {
    const { brand, model } = await params;
    const vehicle = findVehicleByRoute(brand, model);
    if (!vehicle) notFound();
    const engines = engineDNAData.find(item => item.vehicleId === vehicle.id)?.engines || [];
    const schema = isVehicleIndexable(vehicle) ? {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        '@id': `https://otosoz.com/arac-dna/${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}#faq`,
        mainEntity: buildVehicleFaq(vehicle, engines).map(item => ({ '@type': 'Question', name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
    } : null;
    return <>{schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />}<ModelOverviewClient /></>;
}
