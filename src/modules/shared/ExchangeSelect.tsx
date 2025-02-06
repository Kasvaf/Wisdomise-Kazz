import { type ComponentProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useExchanges } from 'api';
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
      showSearch
      searchValue={query}
      onSearch={setQuery}
      render={val => {
        if (!val) return t('common.all_exchanges');
        const cat = options.data?.find(x => x.name === val);
        if (!cat) return val;
        return cat.name;
      }}
      options={
        options.data
          ?.filter(x => x.name.toLowerCase().includes(query.toLowerCase()))
          ?.map(x => x.name)
          .filter(x => !!x) ?? []
      }
      {...props}
    />
  );
}
