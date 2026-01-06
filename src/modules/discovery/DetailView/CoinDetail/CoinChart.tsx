import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AdvancedRealTimeChart } from 'react-ts-tradingview-widgets';
import { useTokenReview } from 'services/rest/discovery';
import AdvancedChart from 'shared/AdvancedChart';
import useIsMobile from 'utils/useIsMobile';
import { useUnifiedCoinDetails } from './lib';

class ChartErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; errorCount: number }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, errorCount: 0 };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Chart error caught by boundary:', error, errorInfo);
  }

  componentDidUpdate(
    _prevProps: { children: ReactNode },
    prevState: { hasError: boolean; errorCount: number },
  ) {
    if (this.state.hasError && !prevState.hasError) {
      // Auto-reset after 2 seconds to allow retry
      setTimeout(() => {
        this.setState({
          hasError: false,
          errorCount: this.state.errorCount + 1,
        });
      }, 2000);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex size-full items-center justify-center bg-v1-surface-l0 text-v1-content-secondary">
          <div className="text-center">
            <div className="mb-2">Chart temporarily unavailable</div>
            <div className="text-xs">Reloading...</div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// TODO: follow mahdi bakhshi to remove this
const _DirtyCoinChart: React.FC<{ height?: number }> = () => {
  const isMobile = useIsMobile();
  const { symbol } = useUnifiedCoinDetails();
  const { data } = useTokenReview({ slug: symbol.slug });
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
  const isMobile = useIsMobile();

  return (
    <ChartErrorBoundary key={isMobile ? 'mobile' : 'desktop'}>
      <AdvancedChart className="size-full" />
    </ChartErrorBoundary>
  );
};

export default CoinChart;
