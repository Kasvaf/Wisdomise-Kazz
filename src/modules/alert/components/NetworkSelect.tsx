import { Select, Spin, type SelectProps } from 'antd';
import { type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useNetworks } from 'api';

export const NetworkSelect: FC<SelectProps<string[]>> = ({
  value,
  className,
  disabled,
  onChange,
  ...props
}) => {
  const { t } = useTranslation('alerts');
  const networks = useNetworks();

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
      maxTagCount={2}
      showArrow={!disabled}
      disabled={disabled}
      filterOption={true}
      allowClear
      mode="multiple"
      loading={networks.isLoading}
      notFoundContent={
        networks.isLoading ? (
          <div className="animate-pulse px-1 py-8 text-center text-xxs text-v1-content-primary">
            <Spin />
          </div>
        ) : undefined
      }
      placeholder={<span>{t('common.all-networks')}</span>}
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
      {...props}
    />
  );
};
