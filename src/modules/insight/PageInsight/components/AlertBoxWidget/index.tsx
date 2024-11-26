import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { OverviewWidget } from 'shared/OverviewWidget';
import bg from './bg.png';
import InsightAlertButton from './AlertButton';

export function AlertBoxWidget({ className }: { className?: string }) {
  const { t } = useTranslation('notifications');
  return (
    <OverviewWidget
      className={clsx(
        'bg-gradient-to-t from-v1-background-brand via-v1-background-brand/30 to-v1-surface-l3 mobile:h-56',
        className,
      )}
      contentClassName="h-full flex h-full flex-col items-center justify-between gap-2 overflow-hidden mobile:flex-row-reverse"
    >
      <div className="grow">
        <img
          src={bg}
          alt="Alerts"
          className="h-full w-[350px] grow object-contain object-center mobile:w-auto"
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
        <InsightAlertButton className="mt-4" />
      </div>
    </OverviewWidget>
  );
}
