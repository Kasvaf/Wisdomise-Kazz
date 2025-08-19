import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';

import useIsMobile from 'utils/useIsMobile';
import AdvancedChart from 'shared/AdvancedChart';
import { useLastCandleQuery } from 'api';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { useUnifiedCoinDetails } from './useUnifiedCoinDetails';

const DirtyCoinChart: React.FC<{ slug: string; height?: number }> = ({
  slug,
}) => {
  const isMobile = useIsMobile();
  const { data } = useUnifiedCoinDetails({ slug });
  const chart = data?.charts ? data?.charts[0] : null;
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
  slug = slug === 'solana' ? 'wrapped-solana' : slug;
  const [quote] = useActiveQuote();
  const lastCandle = useLastCandleQuery({ slug, quote });
  if (lastCandle.isLoading) return null;

  return lastCandle.data?.symbol?.poolAddress &&
    /^(solana|ton|the-open-network)$/.test(
      lastCandle.data?.symbol.network ?? '',
    ) ? (
    <AdvancedChart slug={slug} className="size-full" />
  ) : (
    <DirtyCoinChart slug={slug} />
  );
};

export default CoinChart;
