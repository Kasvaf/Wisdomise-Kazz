import { useTranslation } from 'react-i18next';
import { type Alert } from 'api/alert';

export function AlertFrequency({
  value,
  className,
}: {
  value: Alert;
  className?: string;
}) {
  const { t } = useTranslation('alerts');
  const isOneTime = value.config?.one_time;
  return (
    <span className={className}>
      {isOneTime
        ? t('common.notifications.one-time')
        : t('common.notifications.unlimited-times')}
    </span>
  );
}
