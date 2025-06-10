import { Select, Spin, type SelectProps } from 'antd';
import { useMemo, useState, type FC } from 'react';
import { clsx } from 'clsx';
import { useDebounce } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';
import { useCategories } from 'api/discovery';

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
      className={clsx(
        '[&_.ant-select-selector]:!min-w-44 [&_.ant-select-selector]:!pl-4 [&_.ant-select-selector]:!text-sm',
        '[&_.ant-select-selection-placeholder]:!text-white/60',
        '[&_.ant-select-selection-item]:bg-white/5',
        className,
      )}
      value={value}
      showSearch
      autoClearSearchValue
      maxTagCount={1}
      showArrow={!disabled}
      disabled={disabled}
      searchValue={q}
      onSearch={setQ}
      filterOption={false}
      allowClear={false}
      mode="multiple"
      loading={categories.isLoading}
      popupMatchSelectWidth={false}
      notFoundContent={
        categories.isLoading ? (
          <div className="animate-pulse px-1 py-8 text-center text-xxs text-v1-content-primary">
            <Spin />
          </div>
        ) : undefined
      }
      placeholder={<span>{t('common.all-categories')}</span>}
      onChange={(newValue, x) =>
        onChange?.(newValue.includes('') ? [] : newValue, x)
      }
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
      {...props}
    />
  );
};
