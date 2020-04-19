import { useState, useEffect, useRef } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef();
  const id = useRef();
  const [start, setStart] = useState(false);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    if (start && delay !== null) {
        id.current = setInterval(() => {
            savedCallback.current();
        }, delay);
        return () => clearInterval(id.current);
    }
  }, [start, delay]);

  const startSetInterval = () => {
      setStart(true);
  }

  const stopSetInterval = () => {
      setStart(false);
      clearInterval(id.current);
  }

  return [
    startSetInterval,
    stopSetInterval
  ];
}

export default useInterval;