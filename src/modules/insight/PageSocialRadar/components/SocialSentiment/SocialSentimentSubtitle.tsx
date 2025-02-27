import { type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type SocialRadarSentiment } from 'api';

export const SocialSentimentSubtitle: FC<{
  value?: SocialRadarSentiment['gauge_tag'];
  className?: string;
}> = ({ value, className }) => {
  const { t } = useTranslation('coin-radar');

  return (
    <div className={clsx(className)}>
      {value === 'LONG'
        ? t('call-change.long_desciption')
        : value === 'SHORT'
        ? t('call-change.short_desciption')
        : value === 'NOT SURE'
        ? t('call-change.not_sure_description')
        : value === 'NEUTRAL'
        ? t('call-change.neutral_description')
        : '---'}
    </div>
  );
};
