import { useTranslation } from 'react-i18next';
import { type Alert, type AlertDataSource } from 'api/alert';

export function AlertFrequency<D extends AlertDataSource>({
  value,
  className,
}: {
  value: Alert<D>;
  className?: string;
}) {
  const { t } = useTranslation('alerts');
  return (
    <span className={className}>
      {value.config.one_time
        ? t('forms.notifications.one-time')
        : t('forms.notifications.unlimited-times')}
    </span>
  );
}
