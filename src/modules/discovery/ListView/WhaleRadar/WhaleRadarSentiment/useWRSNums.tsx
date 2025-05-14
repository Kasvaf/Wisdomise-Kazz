import { useTranslation } from 'react-i18next';
import { type WhaleRadarSentiment } from 'api';

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
      color: buy > 0 ? 'text-v1-content-positive' : 'text-v1-content-secondary',
      value: buy,
    },
    {
      label: t('sentiment.sell'),
      color:
        sell > 0 ? 'text-v1-content-negative' : 'text-v1-content-secondary',
      value: sell,
    },
    {
      label: t('sentiment.hold'),
      color: hold > 0 ? 'text-v1-content-notice' : 'text-v1-content-secondary',
      value: hold,
    },
  ];
};
