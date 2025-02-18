import { type ComponentProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNetworks } from 'api';
import { Select } from 'shared/v1-components/Select';

export function NetworkSelect<M extends boolean>({
  filter,
  valueType = 'slug',
  size,
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
  filter?: NonNullable<Parameters<typeof useNetworks>['0']>['filter'];
  valueType?: 'name' | 'slug';
}) {
  const { t } = useTranslation('coin-radar');
  const [query, setQuery] = useState('');
  const options = useNetworks({
    filter,
    query,
  });

  return (
    <Select
      loading={options.isLoading}
      showSearch
      searchValue={query}
      onSearch={setQuery}
      size={size}
      render={val => {
        if (!val) return t('common.all_networks');
        const opt = options.data?.find(x => x[valueType] === val);
        return (
          <div className="flex items-center gap-2">
            <img
              src={opt?.icon_url ?? ''}
              className="size-5 rounded-full bg-v1-surface-l3"
            />
            {opt?.name ?? val}
          </div>
        );
      }}
      options={options.data?.map(x => x[valueType]).filter(x => !!x) ?? []}
      {...props}
    />
  );
}
