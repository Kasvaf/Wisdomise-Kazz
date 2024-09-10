import PageWrapper from 'modules/base/PageWrapper';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { IndicatorSelect, type MarketPulseIndicators } from './IndicatorSelect';
import { RsiTabContent } from './components/RsiTabContent';

export default function PageMarketPulse() {
  const [indicator, setIndicator] =
    useSearchParamAsState<MarketPulseIndicators>('indicator', 'rsi');

  return (
    <PageWrapper className="flex flex-col gap-6">
      <IndicatorSelect value={indicator} onChange={setIndicator} />
      {indicator === 'rsi' && <RsiTabContent />}
    </PageWrapper>
  );
}
