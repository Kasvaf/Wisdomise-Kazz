export const isProduction =
  !window.location.host.includes('stage-') &&
  !window.location.host.includes('localhost');
