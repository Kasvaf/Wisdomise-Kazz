import { useSearchParams } from 'react-router-dom';

const unwrap = <T extends string>(defaultVal?: T | (() => T)) => {
  return typeof defaultVal === 'function' ? defaultVal() : defaultVal;
};

export default function useSearchParamAsState<T extends string>(
  paramName: string,
  defaultVal?: T | (() => T),
) {
  const [searchParams, setSearchParams] = useSearchParams();
  return [
    String(searchParams.get(paramName) ?? unwrap(defaultVal)) as T,
    (newVal: T) => {
      setSearchParams(
        currentSearchParams => {
          const { [paramName]: _, ...rest } = Object.fromEntries(
            currentSearchParams.entries(),
          );
          return newVal === unwrap(defaultVal)
            ? rest
            : { ...rest, [paramName]: newVal };
        },
        {
          replace: true,
        },
      );
    },
  ] as const;
}
