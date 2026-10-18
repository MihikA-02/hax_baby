import { useEffect, useRef, useState } from "react";

/**
 * Types `text` out one character at a time while `enabled` is true.
 * onChar fires for every non-space character, onDone once at the end.
 */
export function useTypewriter(
  text,
  enabled,
  { speed = 28, delay = 250, reduced = false, onChar, onDone } = {},
) {
  const [count, setCount] = useState(0);
  const callbacks = useRef({});
  callbacks.current = { onChar, onDone };

  useEffect(() => {
    if (!enabled) return undefined;
    if (reduced) {
      setCount(text.length);
      callbacks.current.onDone?.();
      return undefined;
    }
    setCount(0);
    let i = 0;
    let interval;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCount(i);
        if (text[i - 1] !== " ") callbacks.current.onChar?.();
        if (i >= text.length) {
          clearInterval(interval);
          callbacks.current.onDone?.();
        }
      }, speed);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [enabled, text, speed, delay, reduced]);

  return { count, done: enabled && count >= text.length };
}
