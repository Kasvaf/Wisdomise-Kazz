import { useCoinDetails } from 'api/discovery';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import AdvancedChart from 'shared/AdvancedChart';
import useIsMobile from 'utils/useIsMobile';
import { useUnifiedCoinDetails } from './lib';

// TODO: follow mahdi bakhshi to remove this
const _DirtyCoinChart: React.FC<{ height?: number }> = () => {
  const isMobile = useIsMobile();
  const { symbol } = useUnifiedCoinDetails();
  const { data } = useCoinDetails({ slug: symbol.slug });
  const chart = data?.charts?.[0] ?? null;
  if (!chart) return null;

  return chart.type === 'gecko_terminal' ? (
    <iframe
      allow="clipboard-write"
      allowFullScreen
      frameBorder="0"
      height="100%"
      id="geckoterminal-embed"
      key={chart.id}
      src={`https://www.geckoterminal.com/${chart.id}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0&chart_type=price&resolution=1m`}
      title="GeckoTerminal Embed"
      width="100%"
    />
  ) : chart.type === 'trading_view' ? (
    <div className="[&>div]:!block size-full">
      <AdvancedRealTimeChart
        allow_symbol_change={false}
        autosize
        disabled_features={isMobile ? ['timeframes_toolbar'] : []}
        enabled_features={
          isMobile
            ? []
            : ['side_toolbar_in_fullscreen_mode', 'header_fullscreen_button']
        }
        hide_legend={isMobile}
        hide_side_toolbar={isMobile}
        hide_top_toolbar={isMobile}
        hotlist={false}
        interval="240"
        key={chart.id}
        style="1"
        symbol={chart.id}
        theme="dark"
      />
    </div>
  ) : null;
};

const CoinChart: React.FC = () => {
  return <AdvancedChart className="size-full" />;
};

export default CoinChart;
