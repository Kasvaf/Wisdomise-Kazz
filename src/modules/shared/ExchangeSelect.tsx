import { useExchanges } from 'api/discovery';
import { type ComponentProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from 'shared/v1-components/Select';

export function ExchangeSelect<M extends boolean>({
  filter,
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
  filter?: NonNullable<Parameters<typeof useExchanges>[0]>['filter'];
}) {
  const { t } = useTranslation('coin-radar');
  const [query, setQuery] = useState('');
  const options = useExchanges({
    filter,
  });

  return (
    <Select
      loading={options.isLoading}
      onSearch={setQuery}
      options={
        options.data
          ?.filter(x => x.name.toLowerCase().includes(query.toLowerCase()))
          ?.map(x => x.name)
          .filter(x => !!x) ?? []
      }
      render={val => {
        if (!val) return t('common.all_exchanges');
        const opt = options.data?.find(x => x.name === val);
        return (
          <div className="flex items-center gap-2">
            <img className="size-5" src={opt?.icon_url ?? ''} />
            {opt?.name ?? val}
          </div>
        );
      }}
      searchValue={query}
      showSearch
      surface={2}
      {...props}
    />
  );
}
