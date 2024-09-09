import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCoinOverview } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';

export function CoinCandleChartWidget({
  slug,
  id,
}: {
  slug: string;
  id?: string;
}) {
  const { t } = useTranslation('coin-radar');
  const coinOverview = useCoinOverview({ slug });

  const tradingViewSymbol = useMemo(() => {
    if (!coinOverview.data) return null;
    return `${coinOverview.data.symbol.abbreviation.toUpperCase()}USDT`;
  }, [coinOverview.data]);

  if (!tradingViewSymbol) return null;
  return (
    <OverviewWidget
      title={t('coin-details.tabs.chart.title')}
      contentClassName="min-h-[600px] overflow-hidden"
      id={id}
    >
      <AdvancedRealTimeChart
        allow_symbol_change={false}
        symbol={tradingViewSymbol}
        style="1"
        hotlist={false}
        theme="dark"
        autosize
      />
    </OverviewWidget>
  );
}
