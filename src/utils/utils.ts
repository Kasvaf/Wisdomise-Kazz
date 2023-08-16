export const isProduction = !window.location.host.includes("stage-") && !window.location.host.includes("localhost");

export const floatData = (data?: number | string, number = 2) => {
  if (data) return parseFloat(data.toString()).toFixed(number);
  return 0;
};

export const convertDate = (date = new Date()) => {
  return date.toISOString().split("T")[0];
};

export const roundDown = (number: number, decimals = 2) => {
  decimals = decimals || 0;
  return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
