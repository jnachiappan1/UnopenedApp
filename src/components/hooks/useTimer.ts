import {useCallback, useEffect, useState} from 'react';

export const useTimer = ({
  initialSeconds = 0,
  initiallyRunning = false,
} = {}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(initiallyRunning);
  const interval =
    (delay = 0) =>
    (callback: any) =>
      useEffect(() => {
        const id = setInterval(callback, delay);

        return () => clearInterval(id);
      }, [callback]);
  const useSecondsInterval = interval(1000);

  const tick = useCallback(
    () => (running ? setSeconds(seconds => seconds - 1) : undefined),
    [running],
  );

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => setSeconds(initialSeconds);
  const stop = () => {
    pause();
    reset();
  };

  useSecondsInterval(tick);

  return {pause, reset, running, seconds, start, stop};
};
