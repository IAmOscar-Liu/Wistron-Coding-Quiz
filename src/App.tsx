import "./styles.css";
import {
  useTimerStore,
  startTimer,
  stopTimer,
  addLap,
  reset
} from "./timerStore";
import Laps from "./components/Laps";
import TimerBox from "./components/TimerBox";

export default function App() {
  const isStarted = useTimerStore((data) => data.isStarted);

  return (
    <div className="App">
      <h1 className="title">Seconds Timer</h1>
      <TimerBox />
      <div className="timer-btns">
        {isStarted ? (
          <>
            <button onClick={stopTimer}>STOP</button>
            <button onClick={addLap}>LAP</button>
          </>
        ) : (
          <>
            <button onClick={startTimer}>START</button>
            <button onClick={reset}>RESET</button>
          </>
        )}
      </div>
      <h2 className="laps-titile">Laps</h2>
      <Laps />
    </div>
  );
}
