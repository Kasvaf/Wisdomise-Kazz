import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { type FC } from 'react';
import { ReactComponent as NotificationIcon } from './notification.svg';
import { ReactComponent as AutoTraderIcon } from './autotrader.svg';
import { ReactComponent as DashboardIcon } from './dashboard.svg';

function FeatureLi({ icon: Icon, text }: { icon: FC; text: string }) {
  return (
    <li className="flex items-center gap-2 text-xs font-normal text-v1-content-primary">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pro-gradient">
        <Icon />
      </div>
      {text}
    </li>
  );
}

export function ProFeatures({ className }: { className?: string }) {
  const { t } = useTranslation('pro');

  return (
    <ul className={clsx('space-y-4', className)}>
      {false && (
        <FeatureLi text={t('features.dashboard')} icon={DashboardIcon} />
      )}
      {false && (
        <FeatureLi text={t('features.auto-trader')} icon={AutoTraderIcon} />
      )}
      <FeatureLi text={t('features.alerts')} icon={NotificationIcon} />
      <FeatureLi text={t('features.coin-overview')} icon={DashboardIcon} />
    </ul>
  );
}
