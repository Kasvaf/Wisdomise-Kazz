import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { useCallback, useMemo, useRef } from 'react';

let depth = 0;

const disableScroll = () => {
  let done = false;

  if (depth++) {
    return () => {
      if (done) return;
      done = true;

      --depth;
    };
  }

  disableBodyScroll(document.body);
  return () => {
    if (done) return;
    done = true;

    --depth;
    enableBodyScroll(document.body);
  };
};

const useBodyScroll = () => {
  const ref = useRef<() => void>();

  const d = useCallback(() => {
    ref.current?.();
    ref.current = disableScroll();
  }, []);

  const e = useCallback(() => {
    ref.current?.();
  }, []);

  return useMemo(
    () => ({
      disable: d,
      enable: e,
    }),
    [d, e],
  );
};

export default useBodyScroll;
