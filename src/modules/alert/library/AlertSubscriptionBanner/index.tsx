import { type FC } from 'react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ReactComponent as UnlockIcon } from './unlock.svg';

export const AlertSubscriptionBanner: FC<{
  className?: string;
}> = ({ className }) => {
  const { t } = useTranslation('alerts');
  return (
    <div
      className={clsx(
        'flex items-center gap-4 rounded-xl bg-v1-surface-l4 p-4 text-xs',
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-v1-surface-l5">
        <UnlockIcon />
      </div>
      <div>
        <div className="mb-1 text-v1-content-secondary">
          {t('common.subscription-banner-title')}
        </div>
        <Link
          to="/account/billing"
          className="block !text-v1-content-link !underline underline-offset-4"
        >
          {t('common.subscription-banner-link')}
        </Link>
      </div>
    </div>
  );
};
