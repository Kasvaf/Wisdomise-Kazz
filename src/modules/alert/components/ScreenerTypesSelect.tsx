import { Select, type SelectProps } from 'antd';
import { type FC } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type Alert } from 'api/alert';

const useScreenerTypes = () => {
  const { t } = useTranslation('alerts');
  return [
    {
      title: t('types.screener.types.social_radar.title'),
      subtitle: t('types.screener.types.social_radar.subtitle'),
      value: 'social_radar',
    },
    {
      title: t('types.screener.types.technical_radar.title'),
      subtitle: t('types.screener.types.technical_radar.subtitle'),
      value: 'technical_radar',
    },
  ];
};

export const ScreenerTypesSelect: FC<SelectProps<Alert['data_source']>> = ({
  value,
  className,
  disabled,
  ...props
}) => {
  const screenerTypes = useScreenerTypes();

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
      options={screenerTypes.map(screenerType => ({
        label: (
          <>
            <span className="pe-3">{screenerType.title}</span>
            <p className="mt-2 !whitespace-normal text-xs font-light text-v1-content-secondary">
              {screenerType.subtitle}
            </p>
          </>
        ),
        value: screenerType.value,
      }))}
      {...props}
    />
  );
};
