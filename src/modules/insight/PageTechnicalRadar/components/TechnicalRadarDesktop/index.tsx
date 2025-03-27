import { Trans, useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useTechnicalRadarCoins } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { useLoadingBar } from 'shared/LoadingBar';
import { TechnicalRadarChart } from '../TechnicalRadarChart';
import {
  type TechnicalRadarView,
  TechnicalRadarViewSelect,
} from '../TechnicalRadarViewSelect';
import { ReactComponent as TechnicalRadarIcon } from '../technical-radar.svg';
import { ConfirmationWidget } from '../ConfirmationWidget';
import { RsiHeatmapWidget } from '../RsiHeatmapWidget';
import { TechnicalRadarCoinsTable } from './TechnicalRadarCoinsTable';

export function TechnicalRadarDesktop() {
  const { t } = useTranslation('market-pulse');
  const [tab, setTab] = useSearchParamAsState<TechnicalRadarView>(
    'overviewTab',
    'chart',
  );
  const technicalTopCoins = useTechnicalRadarCoins({});
  useLoadingBar(technicalTopCoins.isFetching);

  return (
    <div className="grid grid-cols-2 gap-6 mobile:grid-cols-1">
      <OverviewWidget
        className="col-span-full"
        title={
          <>
            <TechnicalRadarIcon className="size-6" />
            {t('base:menu.ai-indicators.title')}
          </>
        }
        subtitle={
          <p className="max-w-xl [&_b]:font-medium [&_b]:text-v1-content-primary">
            <Trans ns="base" i18nKey="menu.ai-indicators.subtitle" />
          </p>
        }
        headerActions={
          <TechnicalRadarViewSelect
            className="w-min"
            value={tab}
            onChange={setTab}
            size="md"
          />
        }
        contentClassName="!min-h-[450px]"
        loading={technicalTopCoins.isLoading}
        empty={technicalTopCoins.data?.length === 0}
      >
        {tab === 'chart' && (
          <div className="grid grid-cols-2 gap-6 mobile:grid-cols-1">
            <div>
              <div
                className={clsx(
                  'text-base font-medium text-v1-content-primary [&_b]:font-medium',
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
                  'text-base font-medium text-v1-content-primary [&_b]:font-medium',
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
