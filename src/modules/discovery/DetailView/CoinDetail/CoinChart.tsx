import { useLastCandleQuery } from 'api';
import { useActiveQuote } from 'modules/autoTrader/useActiveQuote';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import AdvancedChart from 'shared/AdvancedChart';
import useIsMobile from 'utils/useIsMobile';
import { type ComplexSlug, useUnifiedCoinDetails } from './lib';

const DirtyCoinChart: React.FC<{ slug: ComplexSlug; height?: number }> = ({
  slug,
}) => {
  const isMobile = useIsMobile();
  const { data } = useUnifiedCoinDetails({ slug });
  const chart = data?.charts ? data?.charts[0] : null;
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

const CoinChart: React.FC<{ slug: ComplexSlug }> = ({ slug: _slug }) => {
  const slug = _slug.slug === 'solana' ? 'wrapped-solana' : _slug.slug;
  const [quote] = useActiveQuote();
  const lastCandle = useLastCandleQuery({ slug, quote });
  if (lastCandle.isLoading) return null;

  return lastCandle.data?.symbol.pool_address &&
    /^(solana|ton|the-open-network)$/.test(
      lastCandle.data?.symbol.network ?? '',
    ) ? (
    <AdvancedChart className="size-full" slug={_slug} />
  ) : (
    <DirtyCoinChart slug={_slug} />
  );
};

export default CoinChart;
