import { Select, type SelectProps, Spin } from 'antd';
import { useCategories } from 'api/discovery';
import { clsx } from 'clsx';
import { type FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'usehooks-ts';

export const CoinCategoriesSelect: FC<SelectProps<string[]>> = ({
  value,
  className,
  disabled,
  onChange,
  ...props
}) => {
  const { t } = useTranslation('alerts');
  const [q, setQ] = useState('');
  const query = useDebounce(q, 400);
  const categories = useCategories({
    query,
  });

  const categoryOptions = useMemo(() => {
    return [
      ...(categories.data ?? []).filter(x => value?.includes(x.slug)),
      ...(value ?? [])
        .filter(x => !categories.data?.some(c => c.slug === x))
        .map(x => ({
          name: x,
          slug: x,
        })),
      ...(categories.data ?? []).filter(x => !value?.includes(x.slug)),
    ];
  }, [categories.data, value]);

  return (
    <Select
      allowClear={false}
      autoClearSearchValue
      className={clsx(
        '[&_.ant-select-selector]:!min-w-44 [&_.ant-select-selector]:!pl-4 [&_.ant-select-selector]:!text-sm',
        '[&_.ant-select-selection-placeholder]:!text-white/60',
        '[&_.ant-select-selection-item]:bg-white/5',
        className,
      )}
      disabled={disabled}
      filterOption={false}
      loading={categories.isLoading}
      maxTagCount={1}
      mode="multiple"
      notFoundContent={
        categories.isLoading ? (
          <div className="animate-pulse px-1 py-8 text-center text-2xs text-v1-content-primary">
            <Spin />
          </div>
        ) : undefined
      }
      onChange={(newValue, x) =>
        onChange?.(newValue.includes('') ? [] : newValue, x)
      }
      onSearch={setQ}
      options={[
        {
          label: <span className="pe-3">{t('common.all-categories')}</span>,
          value: '',
        },
        ...categoryOptions.map(cat => ({
          label: <span className="pe-3">{cat.name}</span>,
          value: cat.slug,
        })),
      ]}
      placeholder={<span>{t('common.all-categories')}</span>}
      popupMatchSelectWidth={false}
      searchValue={q}
      showArrow={!disabled}
      showSearch
      value={value}
      {...props}
    />
  );
};
