import { type RefObject, useEffect } from 'react';

export const useMutationObserver = (
  root: RefObject<HTMLElement>,
  handler: () => void,
  config?: MutationObserverInit,
) => {
  useEffect(() => {
    if (!root.current) return;

    const observer = new MutationObserver(handler);
    observer.observe(root.current, config);
    handler();

    return () => observer.disconnect();
  }, [config, handler, root]);
};
