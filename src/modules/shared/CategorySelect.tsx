import { type ComponentProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCategories } from 'api/discovery';
import { Select } from 'shared/v1-components/Select';

export function CategorySelect<M extends boolean>({
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
  filter?: NonNullable<Parameters<typeof useCategories>[0]>['filter'];
}) {
  const { t } = useTranslation('coin-radar');
  const [query, setQuery] = useState('');
  const options = useCategories({
    filter,
  });

  return (
    <Select
      loading={options.isLoading}
      showSearch
      searchValue={query}
      onSearch={setQuery}
      render={val => {
        if (!val) return t('common.all_categories');
        const cat = options.data?.find(x => x.slug === val);
        if (!cat) return val;
        return cat.name;
      }}
      options={
        options.data
          ?.filter(x => x.name.toLowerCase().includes(query.toLowerCase()))
          ?.map(x => x.slug)
          .filter(x => !!x) ?? []
      }
      surface={2}
      {...props}
    />
  );
}
