import { Select, Spin, type SelectProps } from 'antd';
import { useState, type FC } from 'react';
import { clsx } from 'clsx';
import { useDebounce } from 'usehooks-ts';
import { useCategories } from 'api';

export const CategoriesSelect: FC<SelectProps<string>> = ({
  value,
  className,
  disabled,
  ...props
}) => {
  const [query, setQuery] = useState('');
  const q = useDebounce(query, 400);
  const categories = useCategories(q);

  return (
    <Select
      className={clsx(
        '[&_.ant-select-selector]:!min-w-44 [&_.ant-select-selector]:!pl-4 [&_.ant-select-selector]:!text-sm',
        '[&_.ant-select-selection-placeholder]:!text-white/60',
        className,
      )}
      value={value}
      showSearch
      autoClearSearchValue
      showArrow={!disabled}
      disabled={disabled}
      searchValue={query}
      onSearch={setQuery}
      filterOption={false}
      allowClear
      loading={categories.isLoading}
      popupMatchSelectWidth={false}
      notFoundContent={
        categories.isLoading ? (
          <div className="animate-pulse px-1 py-8 text-center text-xxs text-v1-content-primary">
            <Spin />
          </div>
        ) : undefined
      }
      placeholder={<span>{'All Categories' /* NAITODO */}</span>}
      options={categories.data?.map(cat => ({
        label: <span className="pe-3">{cat.name}</span>,
        value: cat.name,
      }))}
      {...props}
    />
  );
};
