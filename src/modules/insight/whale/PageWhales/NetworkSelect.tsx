import { Select, type SelectProps } from 'antd';
import { type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { bxGlobe } from 'boxicons-quasar';
import { useNetworks } from 'api';
import Icon from 'shared/Icon';

export const NetworkSelect: FC<
  SelectProps<string> & {
    valueType: 'name' | 'id';
  }
> = ({ valueType, value, className, disabled, loading, ...props }) => {
  const networks = useNetworks();
  const { t } = useTranslation('whale');

  return (
    <Select
      className={clsx(
        '[&_.ant-select-selector]:!pl-4 [&_.ant-select-selector]:!text-base',
        '[&_.ant-select-selection-placeholder]:!text-white/60',
        className,
      )}
      value={value}
      showArrow={false}
      disabled={disabled}
      loading={loading || networks.isLoading}
      allowClear
      placeholder={
        <span>
          <Icon
            name={bxGlobe}
            size={20}
            className="me-2 inline-block align-middle"
          />
          {t('filters.all-chains')}
        </span>
      }
      options={networks.data?.map(network => ({
        label: (
          <>
            <img
              src={network.icon_url}
              alt={network.name}
              className="me-3 ms-px inline-block size-4 rounded-full bg-white"
            />
            {network.name}
          </>
        ),
        value: network[valueType],
      }))}
      {...props}
    />
  );
};
