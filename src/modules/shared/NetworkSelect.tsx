import { type ComponentProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useNetworks } from 'api/discovery';
import { Select } from 'shared/v1-components/Select';

export function NetworkSelect<M extends boolean>({
  filter,
  valueType = 'slug',
  size,
  iconOnly,
  className,
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
  iconOnly?: boolean;
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
      chevron={!iconOnly}
      className={clsx(className, iconOnly && ['aspect-square !p-0'])}
      render={(val, target) => {
        if (!val) {
          return iconOnly && target === 'value' ? (
            <div className="relative flex size-full items-center justify-center">
              <div className="inline-flex size-6 items-center justify-center rounded-full bg-white/10 text-[11px]">
                {'All'}
              </div>
            </div>
          ) : (
            t('common.all_networks')
          );
        }
        const opt = options.data?.find(x => x[valueType] === val);
        if (iconOnly && target === 'value')
          return (
            <div className="relative flex size-full items-center justify-center">
              <img
                src={opt?.icon_url ?? ''}
                className="relative size-6 overflow-hidden rounded-lg"
              />
            </div>
          );
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
