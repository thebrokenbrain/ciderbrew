import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to debounce a value with better performance
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear previous timeout
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timeout
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
