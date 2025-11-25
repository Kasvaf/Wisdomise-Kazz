import { Select, type SelectProps, Spin } from 'antd';
import { clsx } from 'clsx';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNetworks } from 'services/rest/discovery';

export const NetworkSelect: FC<SelectProps<string[]>> = ({
  value,
  className,
  disabled,
  onChange,
  ...props
}) => {
  const { t } = useTranslation('alerts');
  const networks = useNetworks({});

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
      filterOption={true}
      loading={networks.isLoading}
      maxTagCount={2}
      mode="multiple"
      notFoundContent={
        networks.isLoading ? (
          <div className="animate-pulse px-1 py-8 text-center text-v1-content-primary text-xxs">
            <Spin />
          </div>
        ) : undefined
      }
      onChange={(newValue, x) =>
        onChange?.(newValue.includes('') ? [] : newValue, x)
      }
      options={[
        {
          label: <span className="pe-3">{t('common.all-networks')}</span>,
          value: '',
        },
        ...(networks.data ?? []).map(net => ({
          label: <span className="pe-3">{net.name}</span>,
          value: net.slug,
        })),
      ]}
      placeholder={<span>{t('common.all-networks')}</span>}
      showArrow={!disabled}
      showSearch
      value={value}
      {...props}
    />
  );
};
