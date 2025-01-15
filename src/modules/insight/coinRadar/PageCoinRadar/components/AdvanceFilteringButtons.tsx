import { clsx } from 'clsx';
import { useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { Button } from 'shared/v1-components/Button';
import { NetworkSelect } from './NetworkSelect';
import { CategorySelect } from './CategorySelect';
import { CoinLabelSelect } from './CoinLabelSelect';

export function AdvanceFilteringButtons({
  className,
  onReset,
  onChange,
  trendLabels,
  securityLabels,
  networks,
  categories,
}: {
  className?: string;
  onReset?: () => void;
  onChange?: (newState: {
    networks?: string[];
    categories?: string[];
    trendLabels?: string[];
    securityLabels?: string[];
  }) => void;
  trendLabels: string[];
  securityLabels: string[];
  categories: string[];
  networks: string[];
}) {
  const { t } = useTranslation('coin-radar');
  const [open, setOpen] = useState(false);

  return (
    <div className={clsx('flex items-center gap-4', className)}>
      <Button
        variant="ghost"
        size="md"
        className="shrink-0 px-6 mobile:w-full"
        onClick={() => setOpen(true)}
      >
        {t('common.filters')}
        {[categories, networks, trendLabels, securityLabels].some(
          x => x.length > 0,
        ) && '*'}
      </Button>
      <Button
        variant="outline"
        size="md"
        onClick={() => {
          onReset?.();
        }}
        className="shrink-0 mobile:hidden"
      >
        {t('common.reset_filters')}
      </Button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        centered
        className="max-w-[500px] mobile:max-w-[360px] [&_.ant-modal-content]:!bg-v1-surface-l1"
        destroyOnClose
        footer={false}
      >
        <p className="text-xl font-semibold">{t('common.filters')}</p>
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2 mobile:flex-wrap">
            <p className="block basis-1/3 mobile:basis-full">
              {t('common.trend_label')}
            </p>
            <CoinLabelSelect
              className="grow"
              value={trendLabels}
              onChange={newLabels => onChange?.({ trendLabels: newLabels })}
              type="trend_labels"
            />
          </div>
          <div className="flex items-center gap-2 mobile:flex-wrap">
            <p className="block basis-1/3 mobile:basis-full">
              {t('common.security_label')}
            </p>
            <CoinLabelSelect
              className="grow"
              value={securityLabels}
              onChange={newLabels => onChange?.({ securityLabels: newLabels })}
              type="security_labels"
            />
          </div>
          <div className="flex items-center gap-2 mobile:flex-wrap">
            <p className="block basis-1/3 mobile:basis-full">
              {t('common.category')}
            </p>
            <CategorySelect
              className="grow"
              value={categories}
              onChange={newCategories =>
                onChange?.({ categories: newCategories })
              }
            />
          </div>
          <div className="flex items-center gap-2 mobile:flex-wrap">
            <p className="block basis-1/3 mobile:basis-full">
              {t('common.network')}
            </p>
            <NetworkSelect
              className="grow"
              value={networks}
              onChange={newNetworks => onChange?.({ networks: newNetworks })}
            />
          </div>
        </div>
        <div className="mt-20 flex items-center gap-2">
          <Button
            variant="outline"
            size="lg"
            block
            onClick={() => {
              onReset?.();
              setOpen(false);
            }}
            className="shrink-0 grow"
          >
            {t('common.reset_filters')}
          </Button>
          <Button
            variant="primary"
            size="lg"
            block
            onClick={() => {
              setOpen(false);
            }}
            className="shrink-0 grow"
          >
            {t('common.apply_filters')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
