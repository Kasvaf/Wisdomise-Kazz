import PageWrapper from 'modules/base/PageWrapper';
import { MarketPulseOnboarding } from './components/MarketPulseOnboarding';
import { TechnicalOverviewWidget } from './components/TechnicalOverviewWidget';

export default function PageMarketPulse() {
  return (
    <PageWrapper className="flex flex-col gap-6">
      <TechnicalOverviewWidget />

      <MarketPulseOnboarding />
    </PageWrapper>
  );
}
