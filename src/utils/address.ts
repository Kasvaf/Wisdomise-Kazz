export const shortenAddress = (address?: string | null, start = 4, end = 4) => {
  if (!address) return '';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const getAddressSuffix = (address?: string | null, length = 3) => {
  if (!address) return '';
  return address.slice(-length);
};
