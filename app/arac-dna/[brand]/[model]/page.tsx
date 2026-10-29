import { staticVehicleParams } from '@/lib/vehicle-index';
import AracDNAShell from './AracDNAShell';
import { notFound } from 'next/navigation';
import { createSlug } from '@/data/vehicle-dna';
import { engineDNAData } from '@/data/engine-dna';
import { findVehicleByRoute } from '@/lib/aracDnaSeo';
import { isVehicleIndexable } from '@/lib/indexability';
import { buildVehicleFaq } from '@/lib/vehicleFaq';
import ModelOverviewClient from './ModelOverview';

export default async function VehicleModelPage({ params }: { params: Promise<{ brand: string; model: string }> }) {
    const { brand, model } = await params;
    const vehicle = findVehicleByRoute(brand, model);
    if (!vehicle) notFound();
    const engines = engineDNAData.find(item => item.vehicleId === vehicle.id)?.engines || [];
    return <><AracDNAShell vehicle={vehicle}><ModelOverviewClient params={params} /></AracDNAShell></>;
}

export const revalidate = 1800;
export const dynamic = 'force-static';
export const dynamicParams = true;
export function generateStaticParams({params}:{params:{brand:string}}) {return staticVehicleParams(undefined,params.brand);}
