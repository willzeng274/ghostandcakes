import { useRef, useEffect } from "react";

export default function useEventListener(eventName: any, handler: any, element: any = null) {
    const savedHandler = useRef<any>(null);
    useEffect(() => {
      savedHandler.current = handler;
    }, [handler]);
    useEffect(
      () => {
        if (!element) element = window;
        const isSupported = element && element.addEventListener;
        if (!isSupported) return;
        const eventListener = (event: any) => savedHandler.current(event);
        element.addEventListener(eventName, eventListener);
        return () => {
          element.removeEventListener(eventName, eventListener);
        };
      },
      [eventName, element]
    );
  }