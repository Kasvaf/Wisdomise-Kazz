import { clsx } from 'clsx';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as BearishIcon } from './bearish.svg';
import { ReactComponent as BullishIcon } from './bullish.svg';

export const RsiDivergence: FC<{
  value?: -1 | 1 | null;
  className?: string;
  mini?: boolean;
}> = ({ value, className, mini }) => {
  const { t } = useTranslation('market-pulse');
  const hasValue = typeof value === 'number';
  return (
    <span
      className={clsx(
        hasValue
          ? value > 0
            ? 'text-v1-content-positive'
            : 'text-v1-content-negative'
          : 'opacity-70',
        'inline-flex items-center gap-1',
        className,
      )}
    >
      {hasValue ? (
        value > 0 ? (
          <BullishIcon className="shrink-0" />
        ) : (
          <BearishIcon className="shrink-0" />
        )
      ) : (
        <span className="inline-block size-2 shrink-0 rounded-full bg-v1-content-primary opacity-50" />
      )}
      {mini
        ? null
        : hasValue
        ? value > 0
          ? t('indicator_list.rsi.bullish')
          : t('indicator_list.rsi.bearish')
        : t('common:not-available')}
    </span>
  );
};
