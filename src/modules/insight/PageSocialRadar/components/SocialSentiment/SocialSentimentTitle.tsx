import { type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type SocialRadarSentiment } from 'api';
import Happy from './happy.png';
import Sad from './sad.png';

export const SocialSentimentTitle: FC<{
  value?: SocialRadarSentiment | null;
  className?: string;
  icon?: boolean;
  iconSize?: number;
}> = ({ value, className, icon, iconSize = 16 }) => {
  const { t } = useTranslation('coin-radar');

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1',
        value?.gauge_tag === 'LONG'
          ? 'text-v1-content-positive'
          : value?.gauge_tag === 'SHORT'
          ? 'text-v1-content-negative'
          : 'text-v1-content-primary',
        className,
      )}
    >
      {icon !== false && (
        <img
          width={iconSize}
          height={iconSize}
          src={
            value?.gauge_tag === 'LONG'
              ? Happy
              : value?.gauge_tag === 'SHORT'
              ? Sad
              : Happy
          }
          style={{
            width: `${iconSize}px`,
            height: `${iconSize}px`,
          }}
          className={clsx(
            'shrink-0 object-contain',
            value?.gauge_measure === 0 && 'grayscale',
          )}
        />
      )}
      {icon !== true && (
        <span>
          {value?.gauge_tag === 'LONG'
            ? t('call-change.positive')
            : value?.gauge_tag === 'SHORT'
            ? t('call-change.negative')
            : value?.gauge_tag === 'NOT SURE'
            ? t('call-change.not_sure')
            : value?.gauge_tag ?? '---'}
        </span>
      )}
    </div>
  );
};
