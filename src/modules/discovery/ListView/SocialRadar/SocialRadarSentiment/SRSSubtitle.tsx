import type { SocialRadarSentiment } from 'api/discovery';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const SRSSubtitle: FC<{
  value?: SocialRadarSentiment['gauge_tag'];
  className?: string;
}> = ({ value, className }) => {
  const { t } = useTranslation('coin-radar');

  return (
    <div
      className={clsx(
        value !== 'LONG' && value !== 'SHORT' && 'opacity-75',
        className,
      )}
    >
      {value === 'LONG'
        ? t('call-change.long_desciption')
        : value === 'SHORT'
          ? t('call-change.short_desciption')
          : value === 'NEUTRAL'
            ? t('call-change.neutral_description')
            : t('call-change.not_sure_description')}
    </div>
  );
};
