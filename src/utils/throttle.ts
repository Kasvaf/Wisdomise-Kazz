export function throttle<P = void>(fn: (p: P) => void, delay: number) {
  let lastCall = 0;

  return (p: P) => {
    const now = Date.now();
    if (lastCall + delay > now) return;
    lastCall = now;
    fn(p);
  };
}

export function debounce<P = void>(fn: (p: P) => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const clear = () => {
    if (timeout !== null) clearTimeout(timeout);
  };

  return {
    run: (p: P) => {
      clear();
      timeout = setTimeout(() => {
        fn(p);
      }, delay);
    },
    clear,
  };
}

export function animationFrame<P = void>(fn: (p: P) => void) {
  let animationFrame: ReturnType<typeof requestAnimationFrame> | null = null;

  const clear = () => {
    if (animationFrame !== null) cancelAnimationFrame(animationFrame);
  };

  return {
    run: (p: P) => {
      clear();
      animationFrame = requestAnimationFrame(() => {
        fn(p);
      });
    },
    clear,
  };
}
