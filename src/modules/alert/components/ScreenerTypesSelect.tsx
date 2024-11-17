import { Select, type SelectProps } from 'antd';
import { type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type Alert } from 'api/alert';

export const ScreenerTypesSelect: FC<SelectProps<Alert['data_source']>> = ({
  value,
  className,
  disabled,
  ...props
}) => {
  const { t } = useTranslation('alerts');

  return (
    <Select
      className={clsx(
        '[&_.ant-select-selector]:!min-w-44 [&_.ant-select-selector]:!pl-4 [&_.ant-select-selector]:!text-sm',
        '[&_.ant-select-selection-placeholder]:!text-white/60',
        '[&_.ant-select-selection-item_p]:hidden',
        className,
      )}
      value={value}
      showArrow={!disabled}
      disabled={disabled}
      allowClear={false}
      options={[
        {
          label: (
            <>
              <span className="pe-3">
                {t('types.screener.types.social_radar.title')}
              </span>
              <p className="mt-2 !whitespace-normal text-xs font-light text-v1-content-secondary">
                {t('types.screener.types.social_radar.subtitle')}
              </p>
            </>
          ),
          value: 'social_radar',
        },
      ]}
      {...props}
    />
  );
};
