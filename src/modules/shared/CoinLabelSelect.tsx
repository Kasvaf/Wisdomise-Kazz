import { clsx } from 'clsx';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { type CoinLabels, useCoinLabels } from 'services/rest/discovery';
import { CoinLabel } from 'shared/CoinLabels';
import { Select } from 'shared/v1-components/Select';

export function CoinLabelSelect<M extends boolean>({
  type,
  ...props
}: Omit<
  ComponentProps<typeof Select<string, M>>,
  | 'render'
  | 'onSearch'
  | 'options'
  | 'loading'
  | 'showSearch'
  | 'searchValue'
  | 'onSearch'
> & {
  type: keyof CoinLabels;
}) {
  const { t } = useTranslation('coin-radar');
  const options = useCoinLabels({});

  return (
    <Select
      loading={options.isLoading}
      options={options.data?.[type] ?? []}
      render={(val, target) => {
        if (!val) return t('common.all_labels');
        return (
          <CoinLabel
            className={clsx(
              target === 'value' ? '!bg-transparent !px-0' : '!me-3',
            )}
            clickable={false}
            size="md"
            value={val}
          />
        );
      }}
      surface={2}
      {...props}
    />
  );
}
