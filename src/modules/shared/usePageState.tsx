import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
} from 'react';
import { useSessionStorage } from 'usehooks-ts';

function encode(obj: unknown) {
  return encodeURIComponent(
    btoa(
      JSON.stringify(obj, (_, value) =>
        value && typeof value === 'object' && !Array.isArray(value)
          ? Object.keys(value)
              .sort()
              .reduce<any>((acc, key) => {
                acc[key] = value[key];
                return acc;
              }, {})
          : value,
      ),
    ),
  );
}

function decode<T = unknown>(str: string): T {
  return JSON.parse(atob(decodeURIComponent(str))) as T;
}

export const usePageState = <T extends object>(
  prefix: string,
  initialState: T,
) => {
  const [state, setState] = useSessionStorage(prefix, encode(initialState));

  const value = useMemo(() => decode<T>(state), [state]);

  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    x => {
      const newValue = typeof x === 'function' ? x(value) : x;
      setState(encode(newValue));
    },
    [setState, value],
  );

  return useMemo(() => [value, setValue] as const, [value, setValue]);
};
