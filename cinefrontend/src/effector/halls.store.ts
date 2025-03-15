import { createStore, createEffect, createEvent, sample } from "effector";
import { THall } from "../types";
import { AxiosResponse } from "axios";
import { app } from "../app";
import { pending } from "patronum";


type HallsRequest = {
    officeId: number;
}

export const $halls = createStore<THall[]>([]);

export const loadHallsEv = createEvent<HallsRequest>();
export const resetHallsEv = createEvent<null>();
const loadHallsFx = createEffect<HallsRequest, THall[], Error>({
    name: 'loadHallsFx',
    handler: async ({officeId}) => {
        const response = await app.get<HallsRequest, AxiosResponse<THall[]>>(`/halls/${officeId}`);
        return response.data;
    },
});

export const $hallsLoading = pending([loadHallsFx]);

$halls.on(loadHallsFx.doneData, (_, halls) => halls).reset(resetHallsEv);

sample({
    clock: loadHallsEv,
    target: loadHallsFx,
})
