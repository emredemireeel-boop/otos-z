import 'server-only';
import { vehicleDNAData } from '@/data/vehicle-dna';
import { isVehicleIndexable, isVehicleSectionIndexable } from './indexability';
import { trimLevelsData } from '@/data/trim-levels';
import { createSlug } from './vehicle-presentation';

export function getVehicleIndex() {
    return vehicleDNAData.filter(isVehicleIndexable).map(vehicle => ({ id:vehicle.id, brand:vehicle.brand,
        model:vehicle.model, year:vehicle.year, slug:`${createSlug(vehicle.brand)}/${createSlug(vehicle.model)}`,
        dnaScore:vehicle.dnaScore }));
}
export function staticVehicleParams(section?: string, brand?: string) {
    return getVehicleIndex().filter(item => !brand || createSlug(item.brand) === brand)
        .filter(item => !section || isVehicleSectionIndexable(vehicleDNAData.find(vehicle => vehicle.id===item.id)!,section,
            {trims:trimLevelsData.find(record=>record.vehicleId===item.id)?.trims || []}))
        .map(item => ({brand:createSlug(item.brand),model:createSlug(item.model)}));
}
