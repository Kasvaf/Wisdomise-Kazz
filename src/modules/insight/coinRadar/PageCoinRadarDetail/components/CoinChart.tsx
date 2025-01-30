import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { useCoinOverview } from 'api';

const CoinChart: React.FC<{ slug: string; height?: number }> = ({
  slug,
  height,
}) => {
  const coinOverview = useCoinOverview({ slug });
  const chart = coinOverview.data?.charts?.[0];
  if (!chart) return null;

  return chart.type === 'gecko_terminal' ? (
    <iframe
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
      allow_symbol_change={false}
      symbol={chart.id}
      style="1"
      interval="240"
      hotlist={false}
      theme="dark"
      height={height}
      width="100%"
      enabled_features={[
        'side_toolbar_in_fullscreen_mode',
        'header_fullscreen_button',
      ]}
    />
  ) : null;
};

export default CoinChart;
