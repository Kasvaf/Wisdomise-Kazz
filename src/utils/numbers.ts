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

export const formatNumber = (
  input: number | bigint,
  useOptions: {
    addComma?: boolean; // should seperate int part with "," char? for example 1000 becomes 1,000 and 1000.1234 becomes 1,000.1234
    reduceDecimals?: boolean; // should reduce decimals? for example 1.1234 becomes 1.12 and 1.01234 become 1.012
  } = {},
): string => {
  const options: Required<typeof useOptions> = {
    addComma: true,
    reduceDecimals: true,
    ...useOptions,
  };
  let output = input.toString();
  if (options.reduceDecimals) {
    const matched = output.match(/-?\d+\.0*\d{2}/g);
    if (matched && typeof matched[0] === 'string') {
      output = matched[0].replace(/0$/, '');
    }
  }
  if (options.addComma) {
    const [int, dec] = output.split('.');
    output = `${(+int).toLocaleString()}${dec === undefined ? '' : `.${dec}`}`;
  }
  // return `${output} (${input.toString()})`;
  return output;
};
