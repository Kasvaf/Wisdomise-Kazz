import { Component, type ErrorInfo, type ReactNode } from 'react';
import AdvancedChart from 'shared/AdvancedChart';
import useIsMobile from 'utils/useIsMobile';

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

const CoinChart: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <ChartErrorBoundary key={isMobile ? 'mobile' : 'desktop'}>
      <AdvancedChart className="size-full" />
    </ChartErrorBoundary>
  );
};

export default CoinChart;
