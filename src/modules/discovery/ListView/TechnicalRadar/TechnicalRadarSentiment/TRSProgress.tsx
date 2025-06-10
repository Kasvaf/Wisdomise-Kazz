import { type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import {
  type MacdConfirmation,
  type RsiConfirmation,
  type TechnicalRadarSentiment as TechnicalRadarSentimentType,
} from 'api/discovery';

function Progress({ value }: { value: number }) {
  return (
    <div
      className={clsx(
        'relative h-2 w-full justify-self-end overflow-hidden rounded bg-v1-background-disabled',
        value === 0 && 'opacity-80',
      )}
    >
      <div
        className={clsx(
          'absolute left-0 top-0 h-full min-w-1 rounded',
          value === 0
            ? 'bg-v1-content-primary/50 opacity-80'
            : 'bg-v1-content-positive',
        )}
        style={{
          width: `${value * 100}%`,
        }}
      />
    </div>
  );
}

export const TRSProgress: FC<{
  value?:
    | ((RsiConfirmation | MacdConfirmation) & TechnicalRadarSentimentType)
    | null;
  className?: string;
}> = ({ value, className }) => {
  const { t } = useTranslation('market-pulse');

  return (
    <div
      className={clsx(
        'grid items-center gap-x-3 gap-y-px whitespace-nowrap',
        className,
      )}
    >
      <span className="overflow-hidden text-ellipsis text-xxs font-light text-v1-content-secondary">
        {t('keywords.rsi_oversold.label_small')}
      </span>
      <Progress value={value?.rsi_overness_normalized_score ?? 0} />

      <span className="overflow-hidden text-ellipsis text-xxs font-light text-v1-content-secondary">
        {t('keywords.macd_cross_up.label_small')}
      </span>
      <Progress value={value?.macd_cross_normalized_score ?? 0} />

      <span className="overflow-hidden text-ellipsis text-xxs font-light text-v1-content-secondary">
        {t('keywords.rsi_bearish.label_small')}
      </span>
      <Progress value={value?.rsi_divergence_normalized_score ?? 0} />

      <span className="overflow-hidden text-ellipsis text-xxs font-light text-v1-content-secondary">
        {t('keywords.macd_bearish.label_small')}
      </span>
      <Progress value={value?.macd_divergence_normalized_score ?? 0} />
    </div>
  );
};
