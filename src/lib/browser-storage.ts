"use client";

import { useCallback, useSyncExternalStore } from "react";

// Memory fallback keeps the interface usable in private/restricted browsers.
const memory = new Map<string, string>();
const changed = "prosvet-storage-change";

export function useBrowserStorage<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T,
  scope: "localStorage" | "sessionStorage" = "sessionStorage",
) {
  const memoryKey = `${scope}:${key}`;
  const read = useCallback(() => {
    try {
      return memory.get(memoryKey) ?? window[scope].getItem(key) ?? null;
    } catch {
      return memory.get(memoryKey) ?? null;
    }
  }, [key, memoryKey, scope]);
  const subscribe = useCallback(
    (notify: () => void) => {
      const onStorage = (event: StorageEvent) => {
        if (event.key === key || event.key === null) memory.delete(memoryKey);
        notify();
      };
      window.addEventListener("storage", onStorage);
      window.addEventListener(changed, notify);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(changed, notify);
      };
    },
    [key, memoryKey],
  );
  const raw = useSyncExternalStore(subscribe, read, () => null);
  function parse(value: string | null): T {
    try {
      const parsed: unknown = JSON.parse(value ?? "null");
      return validate(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  function update(value: T | ((previous: T) => T)) {
    const next =
      typeof value === "function"
        ? (value as (previous: T) => T)(parse(read()))
        : value;
    const serialized = JSON.stringify(next);
    try {
      window[scope].setItem(key, serialized);
      memory.delete(memoryKey);
    } catch {
      memory.set(memoryKey, serialized);
    }
    window.dispatchEvent(new Event(changed));
  }
  return [parse(raw), update] as const;
}
