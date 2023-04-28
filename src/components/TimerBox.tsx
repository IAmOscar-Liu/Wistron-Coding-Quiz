import { useTimerStore } from "../timerStore";

function TimerBox() {
  const time = useTimerStore((state) => state.time);

  return <p className="timer-box">{(time / 1000).toFixed(2)}</p>;
}

export default TimerBox;
