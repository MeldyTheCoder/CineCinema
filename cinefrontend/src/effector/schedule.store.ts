import { createStore, createEffect, createEvent, sample } from "effector";
import { TOrder, TSchedule, TSeat } from "../types";
import { app } from "../app";
import { pending } from "patronum";
import { stringify } from "qs";
import { camelArray, objectToCamelCase } from "../utils/camelCase";
import { wait } from "./timer.store";

type ScheduleRequest = {
  regionId: number;
  filmId: number;
};

type ScheduleByIdRequest = {
  scheduleId: TSchedule["id"];
};

type WriteScheduleRequest = {
  scheduleId: TSchedule["id"];
  seatId: TSeat["id"];
};

type SeatsRequest = {
  scheduleId: number;
}


export const $schedule = createStore<TSchedule[]>([]);
export const $scheduleElement = createStore<TSchedule | null>(null);
export const $seats = createStore<TSeat[]>([]);

export const loadScheduleEv = createEvent<ScheduleRequest>();
export const resetScheduleEv = createEvent<null>();

const loadScheduleFx = createEffect<ScheduleRequest, TSchedule[], Error>({
  name: "loadScheduleFx",
  handler: async (params) => {
    await wait(500);
    const response = await app.get(`/schedule/?${stringify(params)}`);
    return camelArray<TSchedule[]>(response.data);
  },
});

$schedule.reset(resetScheduleEv);

export const loadScheduleByIdFx = createEffect<
  ScheduleByIdRequest,
  TSchedule,
  Error
>({
  name: "loadScheduleByIdFx",
  handler: async ({ scheduleId }) => {
    const response = await app.get<TSchedule>(`/schedule/by-id/${scheduleId}/`);
    return objectToCamelCase<TSchedule>(response.data);
  },
});

export const loadScheduleSeatsFx = createEffect<SeatsRequest, TSeat[], Error>({
    name: 'loadHallSeatsFx',
    handler: async ({scheduleId}) => {
        const response = await app.get(`/schedule/seats/${scheduleId}`);
        return camelArray<TSeat[]>(response.data);
    }
})

export const writeScheduleEv = createEvent<WriteScheduleRequest>();
const writeScheduleFx = createEffect<WriteScheduleRequest, TOrder, Error>({
  name: "writeScheduleFx",
  handler: ({ scheduleId, seatId }) => {
    throw new Error('Not implemented');
  }
});

export const $scheduleLoading = pending([loadScheduleFx, loadScheduleByIdFx]);
export const $seatsLoading = pending([loadScheduleSeatsFx]);


// sample({
//   clock: loadScheduleByIdFx,
//   target: loadScheduleSeatsFx,
// });

sample({
  clock: loadScheduleSeatsFx.doneData,
  target: $seats,
});

sample({
  clock: loadScheduleFx.doneData,
  target: $schedule,
});

sample({
  clock: loadScheduleEv,
  target: loadScheduleFx,
});

sample({
  clock: writeScheduleEv,
  target: writeScheduleFx,
});

sample({
  clock: loadScheduleByIdFx.doneData,
  target: $scheduleElement,
});
