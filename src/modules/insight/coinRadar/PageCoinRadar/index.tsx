import { useEffectOnce } from 'usehooks-ts';
import PageWrapper from 'modules/base/PageWrapper';
import { track } from 'config/segment';
import { CoinRadarOnboarding } from './components/CoinRadarOnboarding';
import { HotCoinsWidget } from './components/HotCoinsWidget';

export default function PageCoinRadar() {
  useEffectOnce(() => {
    track('Feedback Coin Radar');
  });

  return (
    <PageWrapper>
      <HotCoinsWidget />
      <CoinRadarOnboarding />
    </PageWrapper>
  );
}
