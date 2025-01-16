import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';

export interface CoinChartConfig {
  type: 'gecko_terminal' | 'trading_view';
  id: string;
}

const CoinChart: React.FC<{ value: CoinChartConfig; height?: number }> = ({
  value,
  height,
}) => {
  return value.type === 'gecko_terminal' ? (
    <iframe
      height={height}
      width="100%"
      id="geckoterminal-embed"
      title="GeckoTerminal Embed"
      src={`https://www.geckoterminal.com/${value.id}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0`}
      frameBorder="0"
      allow="clipboard-write"
      allowFullScreen
    />
  ) : value.type === 'trading_view' ? (
    <AdvancedRealTimeChart
      allow_symbol_change={false}
      symbol={value.id}
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
