import {createStore, createEffect, createEvent, sample} from 'effector';
import { TOffice } from '../types';
import { AxiosResponse } from 'axios';
import { app } from '../app';
import { $selectedRegion } from './regions.store';
import { pending } from 'patronum';
import { camelArray } from '../utils/camelCase';


type OfficesRequest = {
    regionId: number;
}

export const $offices = createStore<TOffice[]>([]);

export const loadOfficesEv = createEvent<OfficesRequest>();
export const resetOfficesEv = createEvent<void>();

export const setOffice = createEvent<TOffice>();

export const loadOfficesFx = createEffect<OfficesRequest, TOffice[], Error>({
    name: 'loadOfficesFx',
    handler: async ({regionId}) => {
        const response = await app.get<any, AxiosResponse<TOffice[]>>(`/regions/${regionId}/offices/`);
        return camelArray<TOffice[]>(response.data);
    }
})

$offices.reset(resetOfficesEv);
$offices.on(loadOfficesFx.doneData, (_, offices) => offices);

export const $officesLoading = pending([loadOfficesFx]);

sample({
    clock: loadOfficesEv,
    target: loadOfficesFx,
});

sample({
    clock: $selectedRegion,
    target: loadOfficesFx,
    filter: (selectedOffice) => !!selectedOffice,
    fn: (selectedRegion) => ({regionId: selectedRegion?.id} as OfficesRequest),
})