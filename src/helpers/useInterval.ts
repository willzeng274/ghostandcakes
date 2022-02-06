import React from 'react';

export function useInterval(callback: Function, delay: number | null) {
    const savedCallback = React.useRef<Function>();
  
    React.useEffect(() => {
        (savedCallback as any).current = callback;
    }, [callback]);

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