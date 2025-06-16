import {createStore, createEffect, createEvent, sample} from 'effector';
import { TRegion } from '../types';
import { AxiosResponse } from 'axios';
import { app } from '../app';
import { pending } from 'patronum';
import { camelArray } from '../utils/camelCase';


export const $regions = createStore<TRegion[]>([]);
export const $selectedRegion = createStore<TRegion | null>(null);

export const loadRegionsEv = createEvent<void>();
export const resetRegionsEv = createEvent<void>();

export const loadRegionsFx = createEffect<void, TRegion[], Error>({
    name: 'loadRegionsFx',
    handler: async () => {
        const response = await app.get<any, AxiosResponse<TRegion[]>>(`/regions/`);
        return camelArray<TRegion[]>(response.data);
    }
});

export const setRegionFx = createEffect<TRegion, TRegion, Error>({
    name: 'setRegionFx',
    handler: async (region) => {
        localStorage.setItem('regionId', `${region.id}`);
        return region;
    }
})

export const setRegionEv = createEvent<TRegion>();

$regions.reset(resetRegionsEv);
$regions.on(loadRegionsFx.doneData, (_, regions) => regions);

export const $regionsLoading = pending([loadRegionsFx]);

sample({
    clock: loadRegionsEv,
    target: loadRegionsFx,
});

sample({
    clock: loadRegionsFx.doneData,
    target: $selectedRegion,
    fn: (regions) => {
        const regionId = localStorage.getItem('regionId');
        if (regionId) {
            return regions.find((region) => region.id === +regionId) || null;
        }
        if (regions.length > 0) {
            return regions[0];
        }
        return null;
    },
})

sample({
    clock: setRegionEv,
    target: setRegionFx,
});

sample({
    clock: setRegionFx.doneData,
    target: $selectedRegion,
})

