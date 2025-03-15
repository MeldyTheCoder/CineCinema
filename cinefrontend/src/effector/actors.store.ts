import { createStore, createEffect, sample, createEvent } from "effector";
import { TFilmActor } from "../types";
import { app } from "../app";
import { loadFilmFx } from "./films.store";
import {pending} from 'patronum';
import { wait } from "./timer.store";

type FilmActorsRequest = {
  filmId: number;
};

export const $filmActors = createStore<TFilmActor[]>([]);

export const loadFilmActorsEv = createEvent<FilmActorsRequest>();
export const resetFilmActorsEv = createEvent<void>();

export const loadFilmActorsFx = createEffect<
  FilmActorsRequest,
  TFilmActor[],
  Error
>({
  name: "loadFilmActorsFx",
  handler: async ({ filmId }) => {
    await wait(500);
    const response = await app.get(`/actors/for-film/${filmId}/`);
    return response.data as TFilmActor[];
  },
});

export const $actorsLoading = pending([loadFilmActorsFx]);

$filmActors.reset(resetFilmActorsEv);
$filmActors.on(loadFilmActorsFx.doneData, (_, actors) => actors);

sample({
  clock: loadFilmActorsEv,
  target: loadFilmActorsFx,
});

sample({
  clock: loadFilmFx,
  target: loadFilmActorsEv,
});
