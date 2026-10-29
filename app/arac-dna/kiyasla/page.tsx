import {getVehicleIndex} from '@/lib/vehicle-index';
import DNAComparisonClient from './DNAComparisonClient';
export default async function Page(){return <DNAComparisonClient index={getVehicleIndex()}/>;}
