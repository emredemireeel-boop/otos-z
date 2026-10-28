interface EditorialVehicle {
    id: number;
    brand: string;
    dnaScore: number;
}

/** Önceden mevcut editoryal katalog seçimi; yeni inceleme/onay iddiası üretmez. */
export function isVehicleEditoriallyReviewed(vehicle: EditorialVehicle): boolean {
    return vehicle.id < 2000 && !vehicle.brand.includes('/')
        && ![15, 16, 22].includes(vehicle.id)
        && Number.isInteger(vehicle.dnaScore) && vehicle.dnaScore >= 0 && vehicle.dnaScore <= 100;
}
