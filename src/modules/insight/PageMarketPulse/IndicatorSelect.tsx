import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import Tabs from 'shared/Tabs';

export type MarketPulseIndicators = 'rsi' | 'macd' | 'advanced';

export const IndicatorSelect: FC<{
  onChange: (newValue: MarketPulseIndicators) => void;
  value: MarketPulseIndicators;
}> = ({ onChange, value }) => {
  const { t } = useTranslation('market-pulse');
  return (
    <Tabs
      items={[
        {
          label: t('indicator_list.rsi.label'),
          key: 'rsi',
        },
        {
          label: (
            <>
              {t('indicator_list.macd.label')}
              <span className="ms-2 text-xs font-light opacity-80">
                {t('common:soon')}
              </span>
            </>
          ),
          key: 'macd',
          disabled: true,
        },
        {
          label: (
            <>
              {t('indicator_list.advanced.label')}
              <span className="ms-2 text-xs font-light opacity-80">
                {t('common:soon')}
              </span>
            </>
          ),
          key: 'advanced',
          disabled: true,
        },
      ]}
      activeKey={value}
      onChange={newKey => onChange?.(newKey as MarketPulseIndicators)}
    />
  );
};
