export function throttle<P = void>(fn: (p: P) => void, delay: number) {
  let lastCall = 0;

  return (p: P) => {
    const now = Date.now();
    if (lastCall + delay > now) return;
    lastCall = now;
    fn(p);
  };
}
