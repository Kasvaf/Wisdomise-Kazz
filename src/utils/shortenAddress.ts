export const shortenAddress = (address = '') => {
  const addr = address || '';
  const len = addr.length;
  return `${addr.substring(0, 6)}...${addr.substring(len - 4)}`;
};
