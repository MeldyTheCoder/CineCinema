import {createStore, createEffect, createEvent, sample} from 'effector';
import { TGenre } from '../types';
// import { app } from '../app';
// import { AxiosResponse } from 'axios';
import {genres} from '../test';

export const $genres = createStore<TGenre[]>([]);

export const loadGenresEv = createEvent<void>();
export const resetGenresEv = createEvent<void>();
export const loadGenresFx = createEffect<void, TGenre[], Error>({
    name: 'loadGenresFx',
    handler: async () => {
        // const response = await app.get<undefined, AxiosResponse<TGenre[]>>('/genres/');
        // return response.data;
        return genres;
    }
})

$genres.on(loadGenresFx.doneData, (_, genres) => genres).reset(resetGenresEv);

sample({
    clock: loadGenresEv,
    target: loadGenresFx,
})