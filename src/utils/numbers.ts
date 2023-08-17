export const floatData = (data?: number | string, number = 2) => {
  if (data) {
    return parseFloat(data.toString()).toFixed(number);
  }
  return 0;
};

export const roundDown = (number: number, decimals = 2) => {
  decimals = decimals | 0;
  return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
