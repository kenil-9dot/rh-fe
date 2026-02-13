import { useState, useEffect, useRef } from "react";

/**
 * Returns a value that updates only after the input has been stable for `delay` ms.
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (delay <= 0) {
      setDebouncedValue(value);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      timeoutRef.current = null;
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
}
