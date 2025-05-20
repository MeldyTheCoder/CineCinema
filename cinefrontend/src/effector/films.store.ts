import { createStore, createEffect, createEvent, sample } from "effector";
import { TFilm, TFilmAttachment } from "../types";
import { filmAttachments } from "../test";
import { app } from "../app";
import { AxiosResponse } from "axios";
import {pending} from 'patronum';
import { wait } from "./timer.store";
import { camelArray, objectToCamelCase } from "../utils/camelCase";

type FilmAttachmentsRequest = {
    filmId: number;
}

type FilmRequest = {
    filmId: number;
}

export const $film = createStore<TFilm | null>(null);
export const $films = createStore<TFilm[]>([]);
export const $filmAttachments = createStore<TFilmAttachment[]>([]);

export const loadFilmsEv = createEvent<void>();
export const resetFilmsEv = createEvent<void>();

const loadFilmsFx = createEffect<void, TFilm[], Error>({
    name: 'loadFilmsFx',
    handler: async () => {
        const response = await app.get<any, AxiosResponse<TFilm[]>>('/films/');
        return camelArray<TFilm[]>(response.data);
    }
});

export const loadFilmEv = createEvent<FilmRequest>();
export const resetFilmEv = createEvent<void>();
export const loadFilmFx = createEffect<FilmRequest, TFilm, Error>({
    name: 'loadFilmFx',
    handler: async ({filmId}) => {
        await wait(500);
        const response = await app.get<any, AxiosResponse<TFilm>>(`/films/${filmId}`);
        return objectToCamelCase<TFilm>(response.data);
    }
})

export const loadFilmAttachmentsEv = createEvent<FilmAttachmentsRequest>();
export const resetFilmAttachmentsEv = createEvent<null>();

const loadFilmAttachmentsFx = createEffect<FilmAttachmentsRequest, TFilmAttachment[], Error>({
    name: 'loadFilmAttachmentsFx',
    handler: async ({filmId}) => {
        const response = await app.get<TFilmAttachment[]>(`/films/${filmId}/attachments/`);
        return camelArray<TFilmAttachment[]>(response.data);
    },
});

$films.on(loadFilmsFx.doneData, (_, films) => films).reset(resetFilmsEv);
$filmAttachments.on(loadFilmAttachmentsFx.doneData, (_, attachments) => attachments).reset(resetFilmAttachmentsEv);
$film.on(loadFilmFx.doneData, (_, film) => film).reset(resetFilmEv);

export const $filmsLoading = pending([loadFilmFx, loadFilmsFx]);
export const $filmAttachmentsLoading = pending([loadFilmAttachmentsFx]);

sample({
    clock: loadFilmAttachmentsEv,
    target: loadFilmAttachmentsFx,
});

sample({
    clock: loadFilmsEv,
    target: loadFilmsFx,
});

sample({
    clock: loadFilmEv,
    target: loadFilmFx,
})

sample({
    clock: loadFilmFx,
    target: loadFilmAttachmentsFx,
})