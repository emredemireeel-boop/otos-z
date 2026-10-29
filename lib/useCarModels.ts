'use client';
import {useEffect,useSyncExternalStore} from 'react';
import {subscribeCarModels,carModelsVersion,loadRequestedCarModels} from './car-model-store';
export function useCarModels(){
    const version=useSyncExternalStore(subscribeCarModels,carModelsVersion,()=>0);
    useEffect(()=>{void loadRequestedCarModels().catch(()=>{/* A later selection/render can retry. */});});
    return version;
}
