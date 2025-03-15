import { createStore, createEffect, createEvent, sample } from "effector";
import { TFilm, THall, TOrder, TSchedule, TSeat, TOffice } from "../types";
import dayjs from "dayjs";
import { schedule, seats, users } from "../test";
import { app } from "../app";
import { pending } from "patronum";


type ScheduleRequest = {
    hallId?: THall['id'];
    dateFrom?: dayjs.Dayjs;
    dateTo?: dayjs.Dayjs;
    filmId?: TFilm['id'];
    officeId: TOffice['id'];
}

type WriteScheduleRequest = {
    scheduleId: TSchedule['id'];
    seatId: TSeat['id'];
}

export const $schedule = createStore<TSchedule[]>([]);

export const loadScheduleEv = createEvent<ScheduleRequest>();
export const resetScheduleEv = createEvent<null>();

const loadScheduleFx = createEffect<ScheduleRequest, TSchedule[], Error>({
    name: 'loadScheduleFx',
    handler: async (params) => {
        const response = await app.get('/schedule/', {
            params,
        });
        return response.data;
    },
});

$schedule.reset(resetScheduleEv);

export const $scheduleLoading = pending([loadScheduleFx]);

export const writeScheduleEv = createEvent<WriteScheduleRequest>();
const writeScheduleFx = createEffect<WriteScheduleRequest, TOrder, Error>({
    name: 'writeScheduleFx',
    handler: ({scheduleId, seatId}) => {
        const _schedule = schedule.find((_s) => _s.id === scheduleId);
        const _seat = seats.find((_s) => _s.id === seatId);

        if (!_schedule || !_seat) {
            throw new Error("Расписание или место не найдены!");
        }

        return {
            id: 12,
            seat: _seat,
            schedule: _schedule,
            date_created: dayjs().format('YYYY-MM-DD'),
            total_price: _schedule.film.price * _schedule.hall.price_factor * _seat.price_factor,
            user: users[0],
        } as TOrder;
    }
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
})