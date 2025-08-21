import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { ReactComponent as EmptyIcon } from './empty.svg';

export function EmptySentiment({
  value,
  className,
}: {
  value: 'social_radar' | 'technical_radar' | 'whale_radar';
  className?: string;
}) {
  const { t } = useTranslation('insight');
  return (
    <div
      className={clsx(
        'flex max-w-48 items-center gap-1 text-v1-content-secondary text-xs',
        className,
      )}
    >
      <EmptyIcon className="shrink-0" />
      {value === 'social_radar'
        ? t('empty_sentiment.social_radar')
        : value === 'technical_radar'
          ? t('empty_sentiment.technical_radar')
          : t('empty_sentiment.whale_radar')}
    </div>
  );
}
