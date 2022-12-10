import { useCallback, useRef, useState } from "react";

type LapType = {
  lapNum: number;
  startAt: number;
  lapTime?: number;
  displayClassName?: string;
};

export default function App() {
  const [isStarted, toggleIsStarted] = useState(false);
  const [timeValue, setTimeValue] = useState(0);
  const [laps, setLaps] = useState<LapType[]>([]);
  const intervalRef = useRef<any>(null);

  const startTimer = useCallback(() => {
    // console.log("start timer");
    // console.log(intervalRef.current);
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimeValue((prev) => prev + 10);
      }, 10);
    }
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const handleDisplayClassName = useCallback((currentLaps: LapType[]) => {
    // console.log("handleDisplayClassName");
    if (currentLaps.length < 3) return currentLaps;

    const sortedLaps = [...currentLaps]
      .slice(1)
      .sort((a, b) => a.lapTime! - b.lapTime!);
    const min = sortedLaps[0].lapTime;
    const max = sortedLaps[sortedLaps.length - 1].lapTime;

    return currentLaps.map((l) => {
      if (l.lapTime === min) return { ...l, displayClassName: "green" };
      if (l.lapTime === max) return { ...l, displayClassName: "red" };
      return { ...l, displayClassName: "" };
    });
  }, []);

  const leftButton = !isStarted ? (
    <button
      onClick={() => {
        if (laps.length === 0) setLaps([{ lapNum: 1, startAt: 0 }]);
        toggleIsStarted(true);
        startTimer();
      }}
    >
      START
    </button>
  ) : (
    <button
      onClick={() => {
        toggleIsStarted(false);
        stopTimer();
      }}
    >
      STOP
    </button>
  );
  const rightButton = !isStarted ? (
    <button
      onClick={() => {
        setLaps([]);
        setTimeValue(0);
      }}
    >
      RESET
    </button>
  ) : (
    <button
      onClick={() => {
        setLaps((prev) => {
          const lastLap = prev[0];
          let newLaps = [
            { lapNum: lastLap.lapNum + 1, startAt: timeValue },
            { ...lastLap, lapTime: timeValue - lastLap.startAt },
            ...prev.slice(1),
          ];
          newLaps = handleDisplayClassName(newLaps);
          return newLaps;
        });
      }}
    >
      LAP
    </button>
  );

  return (
    <div className="App">
      <h1 className="title">Seconds Timer</h1>
      <p className="timer-box">{(timeValue / 1000).toFixed(2)}</p>
      <div className="timer-btns">
        {leftButton}
        {rightButton}
      </div>
      <h2 className="laps-titile">Laps</h2>
      <ul>
        <li>
          <p>Lap #</p>
          <p>Lap Time</p>
        </li>
        {laps.map((lap, idx) => (
          <li key={lap.lapNum} className={lap.displayClassName ?? ""}>
            <p>{lap.lapNum}</p>
            <p>
              {idx === 0
                ? ((timeValue - lap.startAt) / 1000).toFixed(2)
                : (lap.lapTime! / 1000).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
