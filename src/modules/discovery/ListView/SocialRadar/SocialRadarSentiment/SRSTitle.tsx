import { clsx } from 'clsx';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { SocialRadarSentiment } from 'services/rest/discovery';

export const SRSTitle: FC<{
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
            : value === 'NEUTRAL'
              ? 'text-v1-content-primary'
              : 'text-v1-content-secondary',
        className,
      )}
    >
      {value === 'LONG'
        ? t('call-change.positive')
        : value === 'SHORT'
          ? t('call-change.negative')
          : value === 'NEUTRAL'
            ? t('call-change.neutral')
            : t('call-change.not_sure')}
    </div>
  );
};
