import { Select, Spin, type SelectProps } from 'antd';
import { useState, type FC } from 'react';
import { clsx } from 'clsx';
import { useDebounce } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';
import { useCategories } from 'api';

export const CategoriesSelect: FC<SelectProps<string>> = ({
  value,
  className,
  disabled,
  ...props
}) => {
  const { t } = useTranslation('coin-radar');
  const [q, setQ] = useState('');
  const query = useDebounce(q, 400);
  const categories = useCategories({
    query,
    filter: 'social-radar-24-hours',
  });

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
      showArrow={false}
      disabled={disabled}
      searchValue={q}
      onSearch={setQ}
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
      placeholder={<span>{t('coin-category.all')}</span>}
      options={categories.data?.map(cat => ({
        label: <span className="pe-3">{cat.name}</span>,
        value: cat.slug,
      }))}
      {...props}
    />
  );
};
