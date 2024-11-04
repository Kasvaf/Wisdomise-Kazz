export const gtmClass = (selector: string) =>
  `gtm_${selector.toLowerCase().split(' ').join('_')}`;
