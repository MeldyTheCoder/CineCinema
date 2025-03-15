import {createStore, createEffect, createEvent, sample} from 'effector';
import { TRegion } from '../types';
import { AxiosResponse } from 'axios';
import { app } from '../app';
import { pending } from 'patronum';


export const $regions = createStore<TRegion[]>([]);
export const $selectedRegion = createStore<TRegion | null>(null);

export const loadRegionsEv = createEvent<void>();
export const resetRegionsEv = createEvent<void>();

export const loadRegionsFx = createEffect<void, TRegion[], Error>({
    name: 'loadRegionsFx',
    handler: async () => {
        const response = await app.get<any, AxiosResponse<TRegion[]>>(`/regions/`);
        return response.data;
    }
})

$regions.reset(resetRegionsEv);
$regions.on(loadRegionsFx.doneData, (_, regions) => regions);

export const $regionsLoading = pending([loadRegionsFx]);

sample({
    clock: loadRegionsEv,
    target: loadRegionsFx,
});