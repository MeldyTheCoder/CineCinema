import { createStore, createEffect, createEvent, sample } from "effector";

export function createCountdown(name: string, timeout: number = 1000) {
    // tick every 1 second

    const startTimer = createEvent<number>();
    const resetTimer = createEvent();

    const $working = createStore(true, { name: `${name}Working` });
    const tick = createEvent<number>(`${name}Tick`);
    const timerFx = createEffect<number, any, Error>(`${name}Timer`).use(() => wait(timeout));
  
    $working.on(resetTimer, () => false).on(startTimer, () => true);
  
    sample({
      source: startTimer,
      filter: timerFx.pending.map((is) => !is),
      target: tick,
    });
  
    sample({
      clock: tick,
      target: timerFx,
    });
  
    const willTick = sample({
      source: timerFx.done.map(({ params }) => (params as any) - 1),
      filter: (seconds) => seconds >= 0,
    });
  
    sample({
      source: willTick,
      filter: $working,
      target: tick,
    });
  
    return { tick, startTimer, resetTimer };
  }
  
  export function wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  