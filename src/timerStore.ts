import { useSyncExternalStore } from "react";

export type Lap = {
  lapNum: number;
  lapTime: number;
};

export type CounterState = {
  isStarted: boolean;
  time: number;
  currentLap: Lap | null;
  savedLaps: Lap[];
};

const INITIAL_STATE: CounterState = Object.freeze({
  isStarted: false,
  time: 0,
  currentLap: null,
  savedLaps: []
});

const createTimerStore = () => {
  let state = { ...INITIAL_STATE };

  let timeInterval: NodeJS.Timer;
  let resumeAt = 0;
  let sumOfSavedLaps = 0;
  let lastPauseTime = 0;

  const listeners = new Set<(state: CounterState) => void>();
  const subscribe = (listener: (state: CounterState) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const emitChange = () => listeners.forEach((listener) => listener(state));

  return {
    startTimer: () => {
      state.isStarted = true;
      resumeAt = +new Date();
      if (!state.currentLap) {
        state.currentLap = { lapNum: 1, lapTime: 0 };
      }
      timeInterval = setInterval(() => {
        const currentTime = lastPauseTime + +new Date() - resumeAt;
        state.time = currentTime;
        state.currentLap = {
          ...state.currentLap!,
          lapTime: currentTime - sumOfSavedLaps
        };
        emitChange();
      }, 10);
      emitChange();
    },
    stopTimer: () => {
      clearInterval(timeInterval);
      lastPauseTime = state.time;
      state.isStarted = false;
      emitChange();
    },
    addLap: () => {
      state.savedLaps = [state.currentLap!, ...state.savedLaps];
      sumOfSavedLaps = state.savedLaps.reduce(
        (acc, cur) => acc + cur.lapTime,
        0
      );
      state.currentLap = { lapNum: state.savedLaps.length + 1, lapTime: 0 };
      emitChange();
    },
    reset: () => {
      clearInterval(timeInterval);
      lastPauseTime = 0;
      resumeAt = 0;
      sumOfSavedLaps = 0;
      state = { ...INITIAL_STATE };
      emitChange();
    },
    useTimerStore: <SelectorOutput>(
      selector: (state: CounterState) => SelectorOutput
    ): SelectorOutput => useSyncExternalStore(subscribe, () => selector(state))
  };
};

const timerStore = createTimerStore();

export const {
  useTimerStore,
  startTimer,
  stopTimer,
  addLap,
  reset
} = timerStore;

export const displayTime = (time: number) => (time / 1000).toFixed(2);
