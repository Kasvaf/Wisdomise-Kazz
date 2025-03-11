import { type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

export const TRSTitle: FC<{
  value?: string | null;
  green?: boolean;
  className?: string;
}> = ({ value, green, className }) => {
  const { t } = useTranslation('market-pulse');
  return (
    <span
      className={clsx(
        'text-sm',
        value
          ? green
            ? 'text-v1-content-positive'
            : 'text-v1-content-negative'
          : 'text-v1-content-secondary',
        className,
      )}
    >
      {value || t('common.no_sentiment')}
    </span>
  );
};
