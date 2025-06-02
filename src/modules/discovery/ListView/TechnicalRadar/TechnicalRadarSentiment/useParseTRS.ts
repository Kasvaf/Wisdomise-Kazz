import {
  type TechnicalRadarSentiment,
  type MacdConfirmation,
  type RsiConfirmation,
} from 'api/discovery';

export const useParseTRS = (
  value?:
    | ((RsiConfirmation | MacdConfirmation) & TechnicalRadarSentiment)
    | null,
) => {
  const isBullish = value?.technical_sentiment
    ?.toLowerCase()
    .includes('bullish');
  const isCheap = value?.technical_sentiment?.toLowerCase().includes('cheap');
  const isBearish = value?.technical_sentiment
    ?.toLowerCase()
    .includes('bearish');
  const isExpensive = value?.technical_sentiment
    ?.toLowerCase()
    .includes('expensive');
  const isGreen = isBullish || isCheap;
  return {
    isBearish,
    isBullish,
    isCheap,
    isExpensive,
    isGreen,
  };
};
