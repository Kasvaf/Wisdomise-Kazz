import { useLocalStorage } from 'usehooks-ts';

export const useChartIsMarketCap = () => {
  return useLocalStorage('tv-market-cap', true);
};

export const useChartConvertToUSD = () => {
  return useLocalStorage('tv-convert-to-usd', true);
};
