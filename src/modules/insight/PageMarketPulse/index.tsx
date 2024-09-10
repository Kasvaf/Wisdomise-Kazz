import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { useRsiDivergence, useRsiOverness } from 'api/market-pulse';
import { IndicatorSelect, type MarketPulseIndicators } from './IndicatorSelect';
import { RsiTabContent } from './components/RsiTabContent';

export default function PageMarketPulse() {
  const [indicator, setIndicator] =
    useSearchParamAsState<MarketPulseIndicators>('indicator', 'rsi');

  useRsiOverness();
  useRsiDivergence();

  return (
    <PageWrapper className="flex flex-col gap-8">
      <IndicatorSelect value={indicator} onChange={setIndicator} />
      {indicator === 'rsi' && <RsiTabContent />}
    </PageWrapper>
  );
}
