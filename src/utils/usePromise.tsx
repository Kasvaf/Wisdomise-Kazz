import { useCallback, useMemo, useRef, useState } from 'react';

export function usePromise<M = unknown, T = unknown>() {
  const [isRunning, setIsRunning] = useState(false);
  const [params, setParams] = useState<M | null>(null);
  const [result, setResult] = useState<T>();
  const [error, setError] = useState<unknown>();
  const resolve = useRef<(value: T) => void>(() => {
    throw new Error('unexpected');
  });
  const reject = useRef<(value?: unknown) => void>(() => {
    throw new Error('unexpected');
  });

  const run = useCallback((newParams: M): Promise<T> => {
    setParams(newParams);
    setIsRunning(true);
    setError(undefined);
    return new Promise<T>((_resolve, _reject) => {
      resolve.current = _resolve;
      reject.current = _reject;
    })
      .then(_result => {
        setResult(_result);
        return _result;
      })
      .catch(_error => {
        setError(_error);
        throw _error;
      })
      .finally(() => {
        setIsRunning(false);
      });
  }, []);

  return useMemo(
    () => ({
      run,
      isRunning,
      result,
      error,
      resolve: resolve.current,
      reject: reject.current,
      params,
    }),
    [run, error, isRunning, params, result],
  );
}
