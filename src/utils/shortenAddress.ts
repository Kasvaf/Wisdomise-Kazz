export const shortenAddress = (address = '') => {
  const addr = address || '';
  const len = addr.length;
  return `${addr.substring(0, 5)}…${addr.substring(len - 3)}`;
};
