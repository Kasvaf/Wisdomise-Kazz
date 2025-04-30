import { type RefObject, useCallback, useLayoutEffect, useState } from 'react';

export const useRowHeight = (
  root: RefObject<HTMLDivElement>,
  optimisticHeight: number,
) => {
  const [height, setHeight] = useState(optimisticHeight);

  const update = useCallback(() => {
    if (!root.current) return;
    setHeight(
      root.current?.querySelector('tr[data-key]')?.getBoundingClientRect?.()
        ?.height ?? optimisticHeight,
    );
  }, [optimisticHeight, root]);

  useLayoutEffect(() => update());

  return height;
};
