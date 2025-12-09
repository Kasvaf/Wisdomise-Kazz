import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TechnicalRadarCoin } from 'services/rest/discovery';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { TechnicalRadarChart } from '../TechnicalRadarChart';

export const TechnicalRadarCoinsCharts: FC<{
  onClick?: (coin: TechnicalRadarCoin) => void;
}> = ({ onClick }) => {
  const { t } = useTranslation('market-pulse');
  const [view, setView] =
    useState<Parameters<typeof TechnicalRadarChart>[0]['type']>(
      'cheap_bullish',
    );
  return (
    <div className="rounded-xl bg-v1-surface-l1 p-2">
      <ButtonSelect
        className="mb-4"
        onChange={setView}
        options={[
          {
            label: (
              <div>
                <p className="-mb-1 font-medium text-v1-content-positive">
                  {`${t('keywords.rsi_oversold.label_equiv')} & ${t(
                    'keywords.rsi_bullish.label_equiv',
                  )}`}
                </p>
                <p className="text-2xs text-v1-content-primary">
                  {t('common.rsi_macd_chart.rsi_and_macd')}
                </p>
              </div>
            ),
            value: 'cheap_bullish',
          },
          {
            label: (
              <div>
                <p className="-mb-1 font-medium text-v1-content-negative">
                  {`${t('keywords.rsi_overbought.label_equiv')} & ${t(
                    'keywords.rsi_bearish.label_equiv',
                  )}`}
                </p>
                <p className="text-2xs text-v1-content-primary">
                  {t('common.rsi_macd_chart.rsi_and_macd')}
                </p>
              </div>
            ),
            value: 'expensive_bearish',
          },
        ]}
        size="md"
        surface={2}
        value={view}
      />
      <TechnicalRadarChart key={view} onClick={onClick} type={view} />
    </div>
  );
};
