import { useNetworks } from 'api/discovery';
import { clsx } from 'clsx';
import { type ComponentProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from 'shared/v1-components/Select';

export function NetworkSelect<M extends boolean>({
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
  valueType?: 'name' | 'slug';
  iconOnly?: boolean;
}) {
  const { t } = useTranslation('coin-radar');
  const [query, setQuery] = useState('');
  const options = useNetworks({
    query,
  });

  return (
    <Select
      chevron={!iconOnly}
      className={clsx(className, iconOnly && ['!p-0 aspect-square'])}
      loading={options.isLoading || options.isPending}
      onSearch={setQuery}
      options={options.data?.map(x => x[valueType]).filter(x => !!x) ?? []}
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
        console.log('here', val, target, options, opt, query);
        if (iconOnly && target === 'value')
          return (
            <div className="relative flex size-full items-center justify-center">
              <img
                className="relative size-6 overflow-hidden rounded-lg"
                src={opt?.icon_url ?? ''}
              />
            </div>
          );
        return (
          <div className="flex items-center gap-2">
            <img
              className="size-5 rounded-full bg-v1-surface-l3"
              src={opt?.icon_url ?? ''}
            />
            {opt?.name ?? val}
          </div>
        );
      }}
      searchValue={query}
      showSearch
      size={size}
      {...props}
    />
  );
}
