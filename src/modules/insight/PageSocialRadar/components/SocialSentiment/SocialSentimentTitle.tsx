import { type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type SocialRadarSentiment } from 'api';

export const SocialSentimentTitle: FC<{
  value?: SocialRadarSentiment['gauge_tag'];
  className?: string;
}> = ({ value, className }) => {
  const { t } = useTranslation('coin-radar');

  return (
    <div
      className={clsx(
        value === 'LONG'
          ? 'text-v1-content-positive'
          : value === 'SHORT'
          ? 'text-v1-content-negative'
          : 'text-v1-content-primary',
        className,
      )}
    >
      {value === 'LONG'
        ? t('call-change.positive')
        : value === 'SHORT'
        ? t('call-change.negative')
        : value === 'NOT SURE'
        ? t('call-change.not_sure')
        : value === 'NEUTRAL'
        ? t('call-change.neutral')
        : '---'}
    </div>
  );
};
