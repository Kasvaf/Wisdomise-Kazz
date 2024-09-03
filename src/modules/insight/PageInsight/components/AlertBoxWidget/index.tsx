import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import SetNotification from 'modules/insight/coinRadar/PageCoinRadar/SetNotification';
import { OverviewWidget } from 'shared/OverviewWidget';
import { useHasFlag } from 'api';
import bg from './bg.png';

export function AlertBoxWidget({ className }: { className?: string }) {
  const { t } = useTranslation('notifications');
  const hasFlag = useHasFlag();
  if (!hasFlag('/insight/coin-radar')) return null;
  return (
    <OverviewWidget
      className={clsx(
        'bg-gradient-to-t from-v1-background-brand via-v1-background-brand/30 to-v1-surface-l3 mobile:h-72',
        className,
      )}
      contentClassName="h-full flex h-full flex-col items-center justify-between gap-2 overflow-hidden mobile:flex-row-reverse"
    >
      <div className="grow">
        <img
          src={bg}
          alt="Alerts"
          className="h-full w-80 grow object-cover object-center mobile:w-auto mobile:object-contain"
        />
      </div>
      <div className="flex w-full shrink-0 flex-col justify-between gap-2 mobile:w-1/2">
        <div className="space-y-2">
          <h3 className="text-base text-v1-content-primary">
            {t('alerts.pages.insight.title')}
          </h3>
          <p className="text-xs text-v1-content-primary">
            {t('alerts.pages.insight.subtitle')}
          </p>
        </div>
        <SetNotification className="mt-4" />
      </div>
    </OverviewWidget>
  );
}
