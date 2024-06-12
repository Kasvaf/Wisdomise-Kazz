export const roundDown = (number: number, decimals = 2) => {
  const tens = Math.pow(10, decimals | 0);
  return Math.floor(number * tens) / tens;
};

export const roundSensible = (value: number) =>
  Math.abs(value)
    .toFixed(value > -1 && value < 1 ? 6 : 3)
    .replace(/(\.0*\d{3})\d*/, '$1')
    .replaceAll(/\.?0+$/g, '');

export const addComma = (number?: number | bigint) =>
  number?.toLocaleString() ?? 0;
