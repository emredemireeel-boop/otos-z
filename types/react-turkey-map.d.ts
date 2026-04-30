declare module 'react-turkey-map' {
    import { ComponentType } from 'react';
    interface TurkeyMapProps {
        showTooltip?: boolean;
        colorData?: Record<string, string>;
        tooltipData?: Record<string, string>;
        onClick?: (data: { plateNumber: string; name: string }) => void;
    }
    const TurkeyMap: ComponentType<TurkeyMapProps>;
    export default TurkeyMap;
}

declare module 'react-turkey-map/src/cities' {
    interface CityData {
        plate: string;
        city: string;
        draw: string;
    }
    const cities: CityData[];
    export default cities;
}

declare module 'turkey-neighbourhoods' {
    export function getCities(): { code: string; name: string }[];
    export function getCityNames(): string[];
    export function getCityCodes(): string[];
    export function getDistrictsByCityCode(code: string): string[];
    export function getDistrictsOfEachCity(): Record<string, string[]>;
    export function isCityCode(code: string): boolean;
    export function isCityName(name: string): boolean;
}
