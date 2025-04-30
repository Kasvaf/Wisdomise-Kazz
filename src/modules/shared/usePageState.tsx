import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const toParam = (prefix: string, param: string) =>
  [prefix, param].filter(x => !!x).join('-');

const TABLE_STATE_ARRAY_SPLITTER = '&&';

export const usePageState = <
  T extends Record<string, string | number | boolean | string[]>,
>(
  queryPrefix: string,
  initialState: T,
) => {
  const initialStateRef = useRef(initialState);
  const [searchParams, setSearchParams] = useSearchParams();
  const [localState, setLocalState] = useState(initialStateRef.current);
  const urlState = useMemo(() => {
    const returnValue = {
      ...(initialStateRef.current as Record<string, any>),
    };
    for (const [paramKeyRaw, initialParamValue] of Object.entries(
      initialStateRef.current,
    )) {
      const searchParamValue = searchParams.get(
        toParam(queryPrefix, paramKeyRaw),
      );
      if (typeof searchParamValue !== 'string') continue;
      if (typeof initialParamValue === 'boolean')
        returnValue[paramKeyRaw] = searchParamValue !== 'false';
      else if (
        typeof initialParamValue === 'number' &&
        !Number.isNaN(Number(searchParamValue)) &&
        searchParamValue.trim() !== ''
      )
        returnValue[paramKeyRaw] = Number(searchParamValue);
      else if (Array.isArray(initialParamValue))
        returnValue[paramKeyRaw] = searchParamValue.split(
          TABLE_STATE_ARRAY_SPLITTER,
        );
      else returnValue[paramKeyRaw] = searchParamValue;
    }
    return returnValue as typeof initialState;
  }, [queryPrefix, searchParams]);

  // Read url (Just once)
  const isUrlFetched = useRef(false);
  useEffect(() => {
    if (isUrlFetched.current) return;
    setLocalState(urlState);
    isUrlFetched.current = true;
  }, [urlState]);

  // Set url with delay
  const setUrlTimeout = useRef<null | ReturnType<typeof setTimeout>>(null);
  useEffect(() => {
    const clearUrlTimeout = () => {
      if (setUrlTimeout.current !== null) {
        clearTimeout(setUrlTimeout.current);
      }
    };
    clearUrlTimeout();
    setUrlTimeout.current = setTimeout(() => {
      setSearchParams(
        currentSearchParams => {
          let newSearchParams = Object.fromEntries(
            currentSearchParams.entries(),
          );
          let isModified = false;
          for (const [paramKeyRaw, paramValue] of Object.entries(localState)) {
            if (paramKeyRaw === 'total') continue;
            const paramKey = toParam(queryPrefix, paramKeyRaw);
            const { [paramKey]: prevValue, ...rest } = newSearchParams;
            const isSame =
              Array.isArray(paramValue) &&
              Array.isArray(initialStateRef.current[paramKeyRaw])
                ? JSON.stringify([...paramValue].sort()) ===
                  JSON.stringify(
                    [...initialStateRef.current[paramKeyRaw]].sort(),
                  )
                : initialStateRef.current[paramKeyRaw] === paramValue;
            const isEmpty =
              paramValue === undefined ||
              (Array.isArray(paramValue) && paramValue.length === 0);
            newSearchParams =
              isSame || isEmpty
                ? rest
                : {
                    ...rest,
                    [paramKey]: Array.isArray(paramValue)
                      ? paramValue.join(TABLE_STATE_ARRAY_SPLITTER)
                      : paramValue.toString(),
                  };
            const newValue = newSearchParams[paramKey];
            if (prevValue !== newValue) isModified = true;
          }
          if (!isModified) return currentSearchParams;
          return newSearchParams;
        },
        {
          replace: true,
        },
      );
    }, 150);
    return () => clearUrlTimeout();
  }, [localState, queryPrefix, setSearchParams]);

  const state = localState;
  const setState = useCallback(
    (newValue: Partial<typeof initialState> | undefined) => {
      setLocalState(p =>
        newValue === undefined
          ? initialStateRef.current
          : { ...p, ...newValue },
      );
    },
    [],
  );

  return useMemo(() => [state, setState] as const, [setState, state]);
};
