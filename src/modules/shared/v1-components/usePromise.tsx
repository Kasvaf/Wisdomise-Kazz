import { useCallback, useMemo, useRef, useState } from 'react';

export function usePromise<M = unknown, T = unknown>() {
  const [isRunning, setIsRunning] = useState(false);
  const [meta, setMeta] = useState<M | null>(null);
  const resolveHandler = useRef<(value: T) => void>(() => {
    throw new Error('unexpected');
  });
  const rejectHandler = useRef<(value?: unknown) => void>(() => {
    throw new Error('unexpected');
  });

  const call = useCallback((newMeta?: M): Promise<T> => {
    setMeta(newMeta ?? null);
    setIsRunning(true);
    return new Promise<T>((resolve, reject) => {
      resolveHandler.current = resolve;
      rejectHandler.current = reject;
    }).finally(() => {
      setIsRunning(false);
    });
  }, []);

  return useMemo(
    () =>
      [
        call,
        {
          isRunning,
          resolve: resolveHandler.current,
          reject: rejectHandler.current,
          meta,
        },
      ] as const,
    [call, isRunning, meta],
  );
}
