import { useMemo } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import {
  useCoinDetails,
  useNCoinDetails,
  type CoinDetails,
} from 'api/discovery';
import useIsMobile from 'utils/useIsMobile';
import AdvancedChart from 'shared/AdvancedChart';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { useLastCandleQuery } from 'api';

const DirtyCoinChart: React.FC<{ slug: string; height?: number }> = ({
  slug,
  height,
}) => {
  const isMobile = useIsMobile();
  const coin = useCoinDetails({ slug });
  const nCoin = useNCoinDetails({ slug });
  const charts = useMemo(() => {
    let charts: Required<CoinDetails['charts']> = [];
    if (nCoin.data?.address) {
      // TODO its toff, fix this
      charts = [
        ...charts,
        {
          id: 'coingecko_manual',
          priority: 0,
          type: 'gecko_terminal',
          url: `https://www.geckoterminal.com/solana/pools/${nCoin.data.address}`,
          embedUrl: `https://www.geckoterminal.com/solana/pools/${nCoin.data.address}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0&chart_type=price&resolution=1m`,
        },
      ];
    }
    if (coin.data?.charts) {
      charts = [...charts, ...coin.data.charts];
    }
    return charts;
  }, [coin, nCoin]);

  const chart = charts.length > 0 ? charts[0] : null;
  if (!chart) return null;

  return chart.type === 'gecko_terminal' ? (
    <iframe
      key={chart.url}
      height={height}
      width="100%"
      id="geckoterminal-embed"
      title="GeckoTerminal Embed"
      src={chart.embedUrl}
      frameBorder="0"
      allow="clipboard-write"
      allowFullScreen
    />
  ) : chart.type === 'trading_view' ? (
    <AdvancedRealTimeChart
      key={chart.url}
      allow_symbol_change={false}
      symbol={chart.id}
      style="1"
      interval="240"
      hotlist={false}
      theme="dark"
      height={height}
      width="100%"
      enabled_features={
        isMobile
          ? []
          : ['side_toolbar_in_fullscreen_mode', 'header_fullscreen_button']
      }
      disabled_features={isMobile ? ['timeframes_toolbar'] : []}
      hide_side_toolbar={isMobile}
      hide_top_toolbar={isMobile}
      hide_legend={isMobile}
    />
  ) : null;
};

const CoinChart: React.FC<{ slug: string; height?: number }> = ({
  slug,
  height,
}) => {
  const [quote] = useSearchParamAsState<string>('quote', 'tether');
  const lastCandle = useLastCandleQuery({ slug, quote });
  if (lastCandle.isLoading) return null;

  return lastCandle.data?.symbol.pool_address &&
    /^(solana|ton|the-open-network)$/.test(
      lastCandle.data?.symbol.network ?? '',
    ) ? (
    <AdvancedChart slug={slug} />
  ) : (
    <DirtyCoinChart slug={slug} height={height} />
  );
};

export default CoinChart;
