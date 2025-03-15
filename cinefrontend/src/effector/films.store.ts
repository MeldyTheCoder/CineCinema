import { createStore, createEffect, createEvent, sample } from "effector";
import { TFilm, TFilmAttachment } from "../types";
import { filmAttachments } from "../test";
import { app } from "../app";
import { AxiosResponse } from "axios";
import {pending} from 'patronum';
import { wait } from "./timer.store";

type FilmAttachmentsRequest = {
    filmId: number;
}

type FilmRequest = {
    filmId: number;
}

export const $film = createStore<TFilm | null>(null);
export const $films = createStore<TFilm[]>([]);
export const $filmAttachments = createStore<TFilmAttachment[]>([]);

export const loadFilmsEv = createEvent<undefined>();
export const resetFilmsEv = createEvent<undefined>();

const loadFilmsFx = createEffect<undefined, TFilm[], Error>({
    name: 'loadFilmsFx',
    handler: async () => {
        const response = await app.get<any, AxiosResponse<TFilm[]>>('/films/');
        return response.data;
    }
});

export const loadFilmEv = createEvent<FilmRequest>();
export const resetFilmEv = createEvent<void>();
export const loadFilmFx = createEffect<FilmRequest, TFilm, Error>({
    name: 'loadFilmFx',
    handler: async ({filmId}) => {
        await wait(500);
        const response = await app.get<any, AxiosResponse<TFilm>>(`/films/${filmId}`);
        return response.data;
    }
})

export const loadFilmAttachmentsEv = createEvent<FilmAttachmentsRequest>();
export const resetFilmAttachmentsEv = createEvent<null>();

const loadFilmAttachmentsFx = createEffect<FilmAttachmentsRequest, TFilmAttachment[], Error>({
    name: 'loadFilmAttachmentsFx',
    handler: ({filmId}) => filmAttachments.filter((_filmAttach) => _filmAttach.film.id === filmId),
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
    clock: loadFilmFx.doneData,
    target: loadFilmAttachmentsEv,
    fn: (film) => ({filmId: film.id} as FilmAttachmentsRequest),
})