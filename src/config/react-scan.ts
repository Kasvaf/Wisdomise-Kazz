export const configReactScan = () => {
  // biome-ignore lint/correctness/noConstantCondition: disabled for production
  if (true) return;

  const f = document.querySelectorAll('script')[0];
  const j = document.createElement('script');
  j.src = '//unpkg.com/react-scan/dist/auto.global.js';
  j.crossOrigin = 'anonymous';

  f.parentNode?.insertBefore(j, f);
};
