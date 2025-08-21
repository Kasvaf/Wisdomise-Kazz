import type { WhaleRadarSentiment } from 'api/discovery';
import { useTranslation } from 'react-i18next';

export const useWRSNums = (value?: WhaleRadarSentiment | null) => {
  const { t } = useTranslation('whale');
  const [buy, sell, hold] = [
    value?.buy_percent ?? 0,
    value?.sell_percent ?? 0,
    value?.hold_percent ?? 0,
  ];
  return [
    {
      label: t('sentiment.buy'),
      shortLabel: 'B',
      color: buy > 0 ? 'text-v1-content-positive' : 'text-v1-content-secondary',
      value: buy,
    },
    {
      label: t('sentiment.sell'),
      shortLabel: 'S',
      color:
        sell > 0 ? 'text-v1-content-negative' : 'text-v1-content-secondary',
      value: sell,
    },
    {
      label: t('sentiment.hold'),
      shortLabel: 'H',
      color: hold > 0 ? 'text-v1-content-notice' : 'text-v1-content-secondary',
      value: hold,
    },
  ];
};
