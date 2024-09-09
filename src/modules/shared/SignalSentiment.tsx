import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type CoinSignal } from 'api';

export const SignalSentiment: FC<{ signal: CoinSignal }> = ({ signal }) => {
  const { t } = useTranslation('coin-radar');
  return (
    <span>
      {signal.gauge_tag === 'LONG'
        ? t('coin-details.tabs.social_sentiment.positive')
        : signal.gauge_tag === 'SHORT'
        ? t('coin-details.tabs.social_sentiment.negative')
        : signal.gauge_tag}
    </span>
  );
};
