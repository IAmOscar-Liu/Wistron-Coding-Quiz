import { useTimerStore, displayTime } from "../timerStore";

function TimerBox() {
  const time = useTimerStore((state) => state.time);

  return <p className="timer-box">{displayTime(time)}</p>;
}

export default TimerBox;
