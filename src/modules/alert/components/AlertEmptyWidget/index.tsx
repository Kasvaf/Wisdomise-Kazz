import { useTranslation } from 'react-i18next';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ReactComponent as EmptyIcon } from './empty.svg';

export function AlertEmptyWidget({ className }: { className?: string }) {
  const { t } = useTranslation('alerts');
  return (
    <OverviewWidget className={className}>
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <EmptyIcon className="shrink-0" />
        <div className="font-medium text-v1-content-primary text-xl">
          {t('common.empty-title')}
        </div>
        <div className="font-medium text-sm text-v1-content-secondary">
          {t('common.empty-description')}
        </div>
      </div>
    </OverviewWidget>
  );
}
