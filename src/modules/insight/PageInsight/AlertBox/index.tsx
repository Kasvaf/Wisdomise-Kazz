import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import SetNotification from 'modules/insight/coinRadar/PageCoinRadar/SetNotification';
import bg from './bg.png';

export function AlertBox({ className }: { className?: string }) {
  const { t } = useTranslation('notifications');

  return (
    <div
      className={clsx(
        'flex h-full flex-col items-center justify-between gap-2 mobile:flex-row-reverse',
        className,
      )}
    >
      <div className="grow">
        <img
          src={bg}
          alt="Alerts"
          className="h-full w-80 object-cover object-center mobile:w-auto mobile:scale-125"
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
    </div>
  );
}
