import React from 'react';

export function useInterval(callback: Function, delay: number) {
    const savedCallback = React.useRef();
  
    // Remember the latest callback.
    React.useEffect(() => {
        (savedCallback as any).current = callback;
    }, [callback]);
  
    // Set up the interval.
    React.useEffect(() => {
      function tick() {
        (savedCallback as any).current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
}