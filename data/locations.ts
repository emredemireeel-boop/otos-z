import citiesData from './cities.json';

export type CityData = typeof citiesData;

export function getAllCities(): string[] {
    return Object.keys(citiesData).sort((a, b) => a.localeCompare(b, 'tr'));
}

export function getDistrictsForCity(city: string): string[] {
    if (!city || !(city in citiesData)) return [];
    // @ts-ignore - access safe by check above
    const districts = citiesData[city];
    return Object.keys(districts).sort((a, b) => a.localeCompare(b, 'tr'));
}

export function formatLocation(city?: string, district?: string): string {
    if (city && district) return `${city}, ${district}`;
    if (city) return city;
    return "";
}
