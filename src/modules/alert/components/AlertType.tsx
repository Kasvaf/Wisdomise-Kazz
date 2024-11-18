import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type Alert } from 'api/alert';
import { useAlertForm } from '../forms';

export function AlertType({
  value,
  className,
}: {
  value: Alert;
  className?: string;
}) {
  const { t } = useTranslation('alerts');
  const alertForm = useAlertForm(value);
  if (!alertForm) return null;
  const { icon: DtIcon, ...rest } = alertForm;
  const title =
    rest.value === 'screener'
      ? value.data_source === 'social_radar'
        ? t('types.screener.types.social_radar.title')
        : value.data_source === 'technical_radar'
        ? t('types.screener.types.technical_radar.title')
        : rest.title
      : rest.value === 'report'
      ? t('types.report.types.social_radar.title')
      : rest.title;

  return (
    <span className={clsx('inline-flex items-center gap-3', className)}>
      <DtIcon className="size-10 rounded-full" />
      {title}
    </span>
  );
}
