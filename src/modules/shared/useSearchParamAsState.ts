import { useSearchParams } from 'react-router-dom';

export default function useSearchParamAsState<T extends string>(
  paramName: string,
  defaultVal?: T,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  return [
    String(searchParams.get(paramName) ?? defaultVal) as T,
    (newVal: T) => {
      setSearchParams(
        currentSearchParams => {
          const { [paramName]: _, ...rest } = Object.fromEntries(
            currentSearchParams.entries(),
          );
          return newVal === defaultVal
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
