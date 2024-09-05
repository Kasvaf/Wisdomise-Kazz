/* eslint-disable import/max-dependencies */
import { useTranslation } from 'react-i18next';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ReactComponent as EmptyIcon } from './empty.svg';

export function AlertEmptyWidget({ className }: { className?: string }) {
  const { t } = useTranslation('alerts');
  return (
    <OverviewWidget
      className={className}
      contentClassName="flex flex-col gap-4 items-center justify-center py-22 h-full"
    >
      <EmptyIcon className="shrink-0" />
      <div className="text-xl font-medium text-v1-content-primary">
        {t('common.empty-title')}
      </div>
      <div className="text-sm font-medium text-v1-content-secondary">
        {t('common.empty-description')}
      </div>
    </OverviewWidget>
  );
}
