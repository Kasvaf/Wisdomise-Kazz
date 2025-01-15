import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useCategories } from 'api';
import { Select } from 'shared/v1-components/Select';

export const CategorySelect: FC<{
  value?: string[];
  onChange?: (newValue?: string[]) => void;
  className?: string;
}> = ({ value, className, onChange }) => {
  const { t } = useTranslation('coin-radar');
  const [query, setQuery] = useState('');
  const categories = useCategories({
    filter: 'social-radar-24-hours',
  });

  return (
    <Select
      className={className}
      block
      value={value}
      onChange={onChange}
      loading={categories.isLoading}
      allowClear
      showSearch
      searchValue={query}
      onSearch={setQuery}
      multiple
      render={val => {
        if (!val) return t('common.all_categories');
        const cat = categories.data?.find(x => x.slug === val);
        if (!cat) return val;
        return cat.name;
      }}
      options={
        categories.data
          ?.filter(x => x.name.toLowerCase().includes(query.toLowerCase()))
          ?.map(x => x.slug)
          .filter(x => !!x) ?? []
      }
    />
  );
};
