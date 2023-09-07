export const isProduction =
  !window.location.hostname.startsWith('stage-') &&
  window.location.hostname !== 'localhost';
