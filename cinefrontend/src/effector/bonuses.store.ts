import { createStore, createEffect, createEvent, sample } from "effector";
import { TBonusResponse } from "../types";
import { app } from "../app";
import { objectToCamelCase } from "../utils/camelCase";
import { pending } from "patronum";

export const $bonusesInfo = createStore<TBonusResponse | null>(null);

export const loadUserBonusesInfoFx = createEffect<void, TBonusResponse, Error>({
  name: "loadUserBonusesInfoFx",
  handler: async () => {
    const response = await app.get<TBonusResponse>("/bonuses/");
    return objectToCamelCase<TBonusResponse>(response.data);
  },
});

export const loadUserBonusesEv = createEvent<void>();

export const $bonusesLoading = pending([loadUserBonusesInfoFx]);

sample({
    clock: loadUserBonusesEv,
    target: loadUserBonusesInfoFx,
});

sample({
    clock: loadUserBonusesInfoFx.doneData,
    target: $bonusesInfo,
});
