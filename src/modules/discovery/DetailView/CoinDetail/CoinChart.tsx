import { useMemo } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import {
  type CoinChart as CoinChartType,
  useCoinDetails,
  useNCoinDetails,
} from 'api/discovery';
import useIsMobile from 'utils/useIsMobile';
import AdvancedChart from 'shared/AdvancedChart';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { useLastCandleQuery } from 'api';

const DirtyCoinChart: React.FC<{ slug: string; height?: number }> = ({
  slug,
}) => {
  const isMobile = useIsMobile();
  const coin = useCoinDetails({ slug });
  const nCoin = useNCoinDetails({ slug });
  const charts = useMemo(() => {
    let charts: CoinChartType[] = [];
    if (nCoin.data?.charts) {
      charts = [...charts, ...nCoin.data?.charts];
    } else if (coin.data?.charts) {
      charts = [...charts, ...coin.data.charts];
    }
    return charts;
  }, [coin, nCoin]);

  const chart = charts.length > 0 ? charts[0] : null;
  if (!chart) return null;

  return chart.type === 'gecko_terminal' ? (
    <iframe
      key={chart.id}
      height="100%"
      width="100%"
      id="geckoterminal-embed"
      title="GeckoTerminal Embed"
      src={`https://www.geckoterminal.com/${chart.id}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0&chart_type=price&resolution=1m`}
      frameBorder="0"
      allow="clipboard-write"
      allowFullScreen
    />
  ) : chart.type === 'trading_view' ? (
    <div className="size-full [&>div]:!block">
      <AdvancedRealTimeChart
        key={chart.id}
        allow_symbol_change={false}
        symbol={chart.id}
        style="1"
        interval="240"
        hotlist={false}
        theme="dark"
        autosize
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
    </div>
  ) : null;
};

const CoinChart: React.FC<{ slug: string }> = ({ slug }) => {
  const [quote] = useSearchParamAsState<string>('quote', 'tether');
  const lastCandle = useLastCandleQuery({ slug, quote });
  if (lastCandle.isLoading) return null;

  return lastCandle.data?.symbol.pool_address &&
    /^(solana|ton|the-open-network)$/.test(
      lastCandle.data?.symbol.network ?? '',
    ) ? (
    <AdvancedChart slug={slug} className="size-full" />
  ) : (
    <DirtyCoinChart slug={slug} />
  );
};

export default CoinChart;
