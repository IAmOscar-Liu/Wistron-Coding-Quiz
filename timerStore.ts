import { useSyncExternalStore } from "react";

type Lap = {
  lapNum: number;
  lapTime: number;
};

type CounterData = {
  isStarted: boolean;
  time: number;
  currentLap: Lap | null;
  savedLaps: Lap[];
};

const createTimerStore = () => {
  const data: CounterData = {
    isStarted: false,
    time: 0,
    currentLap: null,
    savedLaps: []
  };

  let timeInterval: NodeJS.Timer;
  let resumeAt = 0;
  let sumOfSavedLaps = 0;
  let lastPauseTime = 0;

  const listeners = new Set<(data: CounterData) => void>();
  const subscribe = (listener: (data: CounterData) => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const emitChange = () => listeners.forEach((listener) => listener(data));

  return {
    startTimer: () => {
      data.isStarted = true;
      resumeAt = +new Date();
      if (!data.currentLap) {
        data.currentLap = { lapNum: 1, lapTime: 0 };
      }
      timeInterval = setInterval(() => {
        const currentTime = lastPauseTime + +new Date() - resumeAt;
        data.time = currentTime;
        data.currentLap = {
          ...data.currentLap!,
          lapTime: currentTime - sumOfSavedLaps
        };
        emitChange();
      }, 10);
      emitChange();
    },
    stopTimer: () => {
      clearInterval(timeInterval);
      lastPauseTime = data.time;
      data.isStarted = false;
      emitChange();
    },
    addLap: () => {
      data.savedLaps = [data.currentLap!, ...data.savedLaps];
      sumOfSavedLaps = data.savedLaps.reduce(
        (acc, cur) => acc + cur.lapTime,
        0
      );
      data.currentLap = { lapNum: data.savedLaps.length + 1, lapTime: 0 };
      emitChange();
    },
    reset: () => {
      clearInterval(timeInterval);
      lastPauseTime = 0;
      resumeAt = 0;
      sumOfSavedLaps = 0;
      data.isStarted = false;
      data.time = 0;
      data.currentLap = null;
      data.savedLaps = []; // empty laps
      emitChange();
    },
    useTimerStore: <SelectorOutput>(
      selector: (data: CounterData) => SelectorOutput
    ): SelectorOutput => useSyncExternalStore(subscribe, () => selector(data))
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
