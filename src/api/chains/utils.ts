import { useCallback, useEffect, useRef } from 'react';

export function usePromiseOfEffect({
  action,
  done,
  result,
}: {
  action: () => void;
  done?: boolean;
  result?: boolean;
}) {
  const resolver = useRef<((val: boolean) => void) | null>(null);
  const promiseRef = useRef<Promise<boolean> | null>(null);

  // Effect to resolve any pending promise when connected
  useEffect(() => {
    if (resolver.current && done) {
      resolver.current(result ?? false);
      resolver.current = null;
      promiseRef.current = null;
    }
  }, [done, result]);

  // This returns a fresh promise every time you want to wait for a connection
  const awaitConnection = useCallback(() => {
    if (!promiseRef.current) {
      promiseRef.current = new Promise(resolve => {
        resolver.current = resolve;
      });
      void action();
    }
    return promiseRef.current;
  }, [action]);

  return awaitConnection;
}
