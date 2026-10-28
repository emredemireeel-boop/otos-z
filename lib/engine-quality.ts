import signals from '../data/seo-quality/engine.json';
import { isEngineIndexable, type EngineQualitySignal } from './indexability';

export function engineQualitySignal(vehicle: { id: number }, engine: { slug: string }): EngineQualitySignal {
    return (signals.records as Record<string, EngineQualitySignal>)[`${vehicle.id}/${engine.slug}`] || {};
}

export function isEngineRouteIndexable(vehicle: any, engine: any, section = 'genel-bakis') {
    return isEngineIndexable(vehicle, engine, engineQualitySignal(vehicle, engine), section);
}
