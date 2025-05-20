import { createStore, createEffect, createEvent, sample } from "effector";
import { THall, TSeat } from "../types";
import { AxiosResponse } from "axios";
import { app } from "../app";
import { pending } from "patronum";
import { camelArray, objectToCamelCase } from "../utils/camelCase";


type HallsRequest = {
    officeId: number;
}

type HallRequest = {
    hallId: number;
}

export const $halls = createStore<THall[]>([]);
export const $hall = createStore<THall | null>(null);

export const loadHallsEv = createEvent<HallsRequest>();
export const resetHallsEv = createEvent<null>();
const loadHallsFx = createEffect<HallsRequest, THall[], Error>({
    name: 'loadHallsFx',
    handler: async ({officeId}) => {
        const response = await app.get<HallsRequest, AxiosResponse<THall[]>>(`/halls/${officeId}`);
        return camelArray<THall[]>(response.data);
    },
});

export const loadHallFx = createEffect<HallRequest, THall, Error>({
    name: 'loadHallFx',
    handler: async ({hallId}) => {
        const response = await app.get<THall>(`/halls/${hallId}/`);
        return objectToCamelCase<THall>(response.data);
    }
});


export const $hallsLoading = pending([loadHallsFx, loadHallFx]);

$halls.on(loadHallsFx.doneData, (_, halls) => halls).reset(resetHallsEv);

$hall.on(loadHallFx.doneData, (_, hall) => hall);

sample({
    clock: loadHallsEv,
    target: loadHallsFx,
});