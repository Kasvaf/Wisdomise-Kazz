import PageWrapper from 'modules/base/PageWrapper';
import { CoinRadarOnboarding } from './components/CoinRadarOnboarding';
import { HotCoinsWidget } from './components/HotCoinsWidget';

export default function PageCoinRadar() {
  return (
    <PageWrapper>
      <HotCoinsWidget />
      <CoinRadarOnboarding />
    </PageWrapper>
  );
}
