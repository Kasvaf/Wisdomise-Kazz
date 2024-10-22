export const isLocal = /^([\w-]+\.)*localhost$/.test(window.location.hostname);

export const isProduction =
  !window.location.hostname.startsWith('stage-') && !isLocal;

export const isMiniApp = true || window.location.hostname.includes('tg-app');
