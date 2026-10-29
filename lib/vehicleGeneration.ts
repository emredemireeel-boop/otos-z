import { createSlug } from "./vehicle-presentation";
import type { VehicleDNA } from "./dna-types";

export interface VehicleGenerationInfo {
    label: string;
    startYear: number | null;
    endYear: number | null;
}

export function getVehicleGenerationInfo(vehicle: Pick<VehicleDNA, "model" | "year">): VehicleGenerationInfo {
    const yearMatch = vehicle.year.match(/(\d{4})(?:\s*-\s*(\d{4}))?/);
    const generationMatch = vehicle.model.match(/(?:^|\s)(\d+\.?\s*Nesil|Mk\s*\d+|B\d+|E\d+|F\d+)(?=\s|\(|$)/i);

    return {
        label: generationMatch?.[1]?.replace(/(\d+)\s*Nesil/i, "$1. Nesil") || "Jenerasyon bilgisi",
        startYear: yearMatch ? Number(yearMatch[1]) : null,
        endYear: yearMatch ? Number(yearMatch[2] || yearMatch[1]) : null,
    };
}

export function getBaseModelName(model: string): string {
    return model
        .replace(/\s*\([^)]*\)\s*/g, " ")
        .replace(/(?:^|\s)(\d+\.?\s*Nesil|Mk\s*\d+|B\d+|E\d+|F\d+)(?=\s|$)/gi, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function resolveVehicleGeneration<T extends Pick<VehicleDNA, "id" | "brand" | "model" | "year">>(
    vehicles: T[],
    brand: string,
    model: string,
    year: number,
): T | null {
    const normalizedBrand = createSlug(brand);
    const normalizedModel = createSlug(getBaseModelName(model));

    const matches = vehicles.filter((vehicle) => {
        const info = getVehicleGenerationInfo(vehicle);
        return createSlug(vehicle.brand) === normalizedBrand
            && createSlug(getBaseModelName(vehicle.model)) === normalizedModel
            && info.startYear !== null
            && info.endYear !== null
            && year >= info.startYear
            && year <= info.endYear;
    });

    return matches.sort((a, b) => {
        const aInfo = getVehicleGenerationInfo(a);
        const bInfo = getVehicleGenerationInfo(b);
        const aSpan = (aInfo.endYear || 9999) - (aInfo.startYear || 0);
        const bSpan = (bInfo.endYear || 9999) - (bInfo.startYear || 0);
        return aSpan - bSpan;
    })[0] || null;
}
