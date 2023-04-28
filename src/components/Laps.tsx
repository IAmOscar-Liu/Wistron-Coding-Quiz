import { useMemo } from "react";
import { useTimerStore } from "../timerStore";

function CurrentLap() {
  const currentLap = useTimerStore((state) => state.currentLap);

  if (!currentLap) return null;

  return (
    <li>
      <p>{currentLap.lapNum}</p>
      <p>{(currentLap.lapTime / 1000).toFixed(2)}</p>
    </li>
  );
}

function Laps() {
  const savedLaps = useTimerStore((state) => state.savedLaps);

  const [minLap, maxLap] = useMemo(() => {
    if (savedLaps.length < 2) return [0, 0] as const;
    let minLap = 0;
    let maxLap = 0;
    let minTime = Infinity;
    let maxTime = -Infinity;

    for (let lap of savedLaps) {
      if (lap.lapTime < minTime) {
        minTime = lap.lapTime;
        minLap = lap.lapNum;
      }
      if (lap.lapTime > maxTime) {
        maxTime = lap.lapTime;
        maxLap = lap.lapNum;
      }
    }
    return [minLap, maxLap] as const;
  }, [savedLaps]);

  return (
    <ul>
      <li>
        <p>Lap #</p>
        <p>Lap Time</p>
      </li>
      <CurrentLap />
      {savedLaps.map((lap) => (
        <li
          key={lap.lapNum}
          className={
            lap.lapNum === minLap ? "green" : lap.lapNum === maxLap ? "red" : ""
          }
        >
          <p>{lap.lapNum}</p>
          <p>{(lap.lapTime / 1000).toFixed(2)}</p>
        </li>
      ))}
    </ul>
  );
}

export default Laps;
