import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { type TechnicalRadarCoin } from 'api/discovery';
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
    <div className="rounded-xl bg-v1-surface-l2 p-2">
      <ButtonSelect
        value={view}
        onChange={setView}
        size="md"
        className="mb-4"
        options={[
          {
            label: (
              <div>
                <p className="-mb-1 font-medium text-v1-content-positive">
                  {`${t('keywords.rsi_oversold.label_equiv')} & ${t(
                    'keywords.rsi_bullish.label_equiv',
                  )}`}
                </p>
                <p className="text-xxs text-v1-content-primary">
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
                <p className="text-xxs text-v1-content-primary">
                  {t('common.rsi_macd_chart.rsi_and_macd')}
                </p>
              </div>
            ),
            value: 'expensive_bearish',
          },
        ]}
        surface={2}
      />
      <TechnicalRadarChart key={view} type={view} onClick={onClick} />
    </div>
  );
};
