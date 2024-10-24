export const isLocal = /^([\w-]+\.)*localhost$/.test(window.location.hostname);

export const isProduction =
  !window.location.hostname.startsWith('stage-') && !isLocal;

export const isMiniApp =
  (isLocal && import.meta.env.VITE_IS_MINIAPP) ||
  window.location.hostname.includes('tg-app');
