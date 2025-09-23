import { useTechnicalRadarCoins } from 'api/discovery';
import { clsx } from 'clsx';
import QuickBuySettings from 'modules/autoTrader/BuySellTrader/QuickBuy/QuickBuySettings';
import { Trans, useTranslation } from 'react-i18next';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { OverviewWidget } from 'shared/OverviewWidget';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { ConfirmationWidget } from '../ConfirmationWidget';
import { RsiHeatmapWidget } from '../RsiHeatmapWidget';
import { TechnicalRadarChart } from '../TechnicalRadarChart';
import {
  type TechnicalRadarView,
  TechnicalRadarViewSelect,
} from '../TechnicalRadarViewSelect';
import { ReactComponent as TechnicalRadarIcon } from '../technical-radar.svg';
import { TechnicalRadarCoinsTable } from './TechnicalRadarCoinsTable';

export function TechnicalRadarExpanded() {
  const { t } = useTranslation('market-pulse');
  const [tab, setTab] = useSearchParamAsState<TechnicalRadarView>(
    'technical-radar-tab',
    'chart',
  );
  const technicalTopCoins = useTechnicalRadarCoins({});
  useLoadingBadge(technicalTopCoins.isFetching);

  return (
    <div className="grid grid-cols-2 mobile:grid-cols-1 gap-6 p-3">
      <OverviewWidget
        className="col-span-full"
        contentClassName="!min-h-[450px]"
        empty={technicalTopCoins.data?.length === 0}
        headerActions={
          <div className="flex gap-2">
            <QuickBuySettings source="technical_radar" />
            <TechnicalRadarViewSelect
              className="w-min"
              onChange={setTab}
              size="xs"
              value={tab}
            />
          </div>
        }
        info={
          <p className="[&_b]:text-v1-content-primary [&_b]:underline">
            <Trans i18nKey="menu.ai-indicators.subtitle" ns="base" />
          </p>
        }
        loading={technicalTopCoins.isLoading}
        title={
          <>
            <TechnicalRadarIcon className="size-6" />
            {t('base:menu.ai-indicators.title')}
          </>
        }
      >
        {tab === 'chart' && (
          <div className="grid grid-cols-2 mobile:grid-cols-1 gap-6">
            <div>
              <div
                className={clsx(
                  'font-medium text-base text-v1-content-primary [&_b]:font-medium',
                  '[&_b]:text-v1-content-positive',
                )}
              >
                {t('common.rsi_macd_chart.opportunities')}
                {': '}
                <b>
                  {`${t('keywords.rsi_oversold.label_equiv')} & ${t(
                    'keywords.rsi_bullish.label_equiv',
                  )}`}
                </b>{' '}
                {t('common.rsi_macd_chart.rsi_and_macd')}
              </div>
              <TechnicalRadarChart type="cheap_bullish" />
            </div>
            <div>
              <div
                className={clsx(
                  'font-medium text-base text-v1-content-primary [&_b]:font-medium',
                  '[&_b]:text-v1-content-negative',
                )}
              >
                {t('common.rsi_macd_chart.cautions')}
                {': '}
                <b>
                  {`${t('keywords.rsi_overbought.label_equiv')} & ${t(
                    'keywords.rsi_bearish.label_equiv',
                  )}`}
                </b>{' '}
                {t('common.rsi_macd_chart.rsi_and_macd')}
              </div>
              <TechnicalRadarChart type="expensive_bearish" />
            </div>
          </div>
        )}
        {tab === 'table' && <TechnicalRadarCoinsTable />}
      </OverviewWidget>
      <ConfirmationWidget indicator="rsi" type="bullish" />
      <ConfirmationWidget indicator="macd" type="bullish" />
      <RsiHeatmapWidget className="col-span-full" />
      <ConfirmationWidget indicator="rsi" type="bearish" />
      <ConfirmationWidget indicator="macd" type="bearish" />
    </div>
  );
}
