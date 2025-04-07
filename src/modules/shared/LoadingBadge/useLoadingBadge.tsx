import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from 'react';

const context = createContext<ReturnType<typeof useState<string[]>> | null>(
  null,
);

export const LoadingBadgeProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const state = useState<string[]>();
  return <context.Provider value={state}>{children}</context.Provider>;
};

export const useLoadingBadge = (value?: boolean) => {
  const state = useContext(context);
  const id = useRef(crypto.randomUUID());

  if (!state) throw new Error('unexpected');
  const [loaders, setLoaders] = state;

  const add = useCallback(
    () =>
      setLoaders(p => [
        ...(p?.filter(x => x !== id.current) ?? []),
        id.current,
      ]),
    [setLoaders],
  );
  const remove = useCallback(
    () => setLoaders(p => [...(p?.filter(x => x !== id.current) ?? [])]),
    [setLoaders],
  );

  useEffect(() => {
    if (value) {
      add();
    } else {
      remove();
    }
    return () => remove();
  }, [value, add, remove]);

  return !!loaders?.length;
};
