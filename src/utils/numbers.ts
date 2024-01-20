export const roundDown = (number: number, decimals = 2) => {
  const tens = Math.pow(10, decimals | 0);
  return Math.floor(number * tens) / tens;
};

export const addComma = (number?: number | bigint) =>
  number?.toLocaleString() ?? 0;
