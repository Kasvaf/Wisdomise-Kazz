export const shortenAddress = (address: string) => {
  const len = address.length;
  return `${address.substring(0, 6)}...${address.substring(len - 4)}`;
};
