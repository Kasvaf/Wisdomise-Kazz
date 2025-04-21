import { type ComponentProps } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useCoinLabels } from 'api';
import { Select } from 'shared/v1-components/Select';
import { CoinLabel } from 'shared/CoinLabels';
import { type CoinLabels } from 'api/types/shared';

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
      render={(val, target) => {
        if (!val) return t('common.all_labels');
        return (
          <CoinLabel
            value={val}
            popup={false}
            className={clsx(target === 'value' && '!bg-transparent !px-0')}
            size="md"
          />
        );
      }}
      options={options.data?.[type] ?? []}
      {...props}
    />
  );
}
