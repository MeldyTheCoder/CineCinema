import { createStore, createEffect, createEvent, sample } from "effector";
import { THall, TSeat, TSeatType } from "../types";
import { seats } from "../test";


type SeatsRequest = {
    hallId: THall['id'];
    type?: TSeatType; 
}

function seatReducer(seat: TSeat, params: SeatsRequest) {
    const result = [];

    result.push(seat.hall.id === params.hallId);
    if (params.type) {
        result.push(seat.type === params.type);
    }

    return result.every((value) => value);
}

export const $seats = createStore<TSeat[]>([]);
export const loadSeatsEv = createEvent<SeatsRequest>();

const loadSeatsFx = createEffect<SeatsRequest, TSeat[], Error>({
    name: 'loadSeatsFx',
    handler: ({hallId, type}) => seats.filter((seat) => seatReducer(seat, {hallId, type})),
});

$seats.on(loadSeatsFx.doneData, (_, seats) => seats);

sample({
    clock: loadSeatsEv,
    target: loadSeatsFx,
})