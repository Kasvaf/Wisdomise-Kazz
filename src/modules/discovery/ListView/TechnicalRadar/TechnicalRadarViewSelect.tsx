import { bxListUl, bxNetworkChart } from 'boxicons-quasar';
import { type ComponentProps, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'shared/Icon';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';

export type TechnicalRadarView = 'chart' | 'table';

export const TechnicalRadarViewSelect: FC<
  {
    value: TechnicalRadarView;
    onChange: (newValue: TechnicalRadarView) => void;
  } & Omit<
    ComponentProps<typeof ButtonSelect>,
    'value' | 'onChange' | 'options' | 'allowClear'
  >
> = ({ value, onChange, ...props }) => {
  const { t } = useTranslation('market-pulse');
  return (
    <ButtonSelect
      {...props}
      value={value}
      onChange={onChange}
      options={[
        {
          label: (
            <>
              <Icon name={bxListUl} size={16} />
              {t('common.table_view')}
            </>
          ),
          value: 'table' as const,
        },
        {
          label: (
            <>
              <Icon name={bxNetworkChart} size={16} />
              {t('common.chart_view')}
            </>
          ),
          value: 'chart' as const,
        },
      ]}
    />
  );
};
