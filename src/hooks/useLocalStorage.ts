"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch (error) {
      console.error("useLocalStorage read error", error);
    }
  }, [key]);

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error("useLocalStorage write error", error);
      }
      return valueToStore;
    });
  };

  return [storedValue, setValue];
}
