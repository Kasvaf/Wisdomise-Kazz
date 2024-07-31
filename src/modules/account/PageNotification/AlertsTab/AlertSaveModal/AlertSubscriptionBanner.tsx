import { type FC } from 'react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ReactComponent as UnlockIcon } from './unlock.svg';

export const AlertSubscriptionBanner: FC<{
  className?: string;
}> = ({ className }) => {
  const { t } = useTranslation('notifications');
  return (
    <div className={clsx('inline-flex items-center gap-4 text-xs', className)}>
      <div className="flex size-12 items-center justify-center rounded-full bg-black/20">
        <UnlockIcon />
      </div>
      <div>
        <p className="mb-1 text-white/60">
          {t('alerts.form.subscription-banner-title')}
        </p>
        <Link
          to="/account/billing"
          className="block text-sky-500 underline underline-offset-4 hover:text-sky-600"
        >
          {t('alerts.form.subscription-banner-link')}
        </Link>
      </div>
    </div>
  );
};
