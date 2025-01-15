import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { useCoinOverview } from 'api';

const CoinChart: React.FC<{ slug?: string; height?: number }> = ({
  slug,
  height,
}) => {
  const coinOverview = useCoinOverview({ slug });

  const hasChart =
    coinOverview.data?.charts_id?.trading_view_chart_id ||
    coinOverview.data?.charts_id?.gecko_terminal_chart_id;
  if (!hasChart) return null;

  return coinOverview.data?.charts_id?.trading_view_chart_id ? (
    <AdvancedRealTimeChart
      allow_symbol_change={false}
      symbol={coinOverview.data.charts_id.trading_view_chart_id}
      style="1"
      interval="60"
      hide_side_toolbar
      hotlist={false}
      theme="dark"
      height={height}
      width="100%"
    />
  ) : coinOverview.data?.charts_id?.gecko_terminal_chart_id ? (
    <iframe
      height={height}
      width="100%"
      id="geckoterminal-embed"
      title="GeckoTerminal Embed"
      src={`https://www.geckoterminal.com/${coinOverview.data.charts_id.gecko_terminal_chart_id}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0`}
      frameBorder="0"
      allow="clipboard-write"
      allowFullScreen
    />
  ) : null;
};

export default CoinChart;
