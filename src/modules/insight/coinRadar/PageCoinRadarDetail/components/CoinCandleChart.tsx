import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { useMemo } from 'react';
import { useCoinOverview } from 'api';

export function CoinCandleChart({ slug }: { slug: string }) {
  const coinOverview = useCoinOverview({ slug });

  const tradingViewSymbol = useMemo(() => {
    if (!coinOverview.data) return null;
    return `GATEIO:${coinOverview.data.symbol.abbreviation.toUpperCase()}USDT`;
  }, [coinOverview.data]);

  if (!tradingViewSymbol) return null;
  return (
    <>
      <AdvancedRealTimeChart
        allow_symbol_change={false}
        symbol={tradingViewSymbol}
        style="1"
        hotlist={false}
        theme="dark"
        autosize
      />
    </>
  );
}
