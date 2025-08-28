import { type RefObject, useEffect, useState } from 'react';

export const usePausedData = <V>(
  dataSource: V[],
  hoverElementRef: RefObject<HTMLElement>,
) => {
  const [isPaused, setIsPaused] = useState(false);
  const [data, setData] = useState<V[]>(dataSource);

  useEffect(() => {
    const el = hoverElementRef.current;
    if (!el) return;

    const handleEnter = () => setIsPaused(true);
    const handleLeave = () => setIsPaused(false);

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [hoverElementRef.current]);

  useEffect(() => {
    if (!isPaused) {
      setData(dataSource);
    }
  }, [dataSource, isPaused]);

  return { data, isPaused };
};
