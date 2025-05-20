import {createStore, createEffect, sample, createEvent} from 'effector';

type CheckIsAdultResponse = boolean | null;

export const $isAdult = createStore<CheckIsAdultResponse>(null);

const checkIsAdultFx = createEffect<void, CheckIsAdultResponse, Error>({
    name: 'checkIsAdultFx',
    handler: async () => {
        const isAdultStorageKey = localStorage.getItem('isAdult');
        if (!isAdultStorageKey) {
            return null;
        }
        return isAdultStorageKey === 'true';
    }
})

const setIsAdultFx = createEffect<boolean, void, Error>({
    name: 'setIsAdultFx',
    handler: async (value) => {
        localStorage.setItem('isAdult', value.toString());
    }
})

export const checkIsAdultEv = createEvent<void>();
export const setIsAdultEv = createEvent<boolean>();

sample({
    clock: checkIsAdultFx.doneData,
    target: $isAdult,
});

sample({
    clock: setIsAdultFx,
    target: $isAdult,
});

sample({
    clock: checkIsAdultEv,
    target: checkIsAdultFx,
});

sample({
    clock: setIsAdultEv,
    target: setIsAdultFx,
});