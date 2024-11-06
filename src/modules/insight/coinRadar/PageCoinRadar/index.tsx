import { useEffectOnce } from 'usehooks-ts';
import PageWrapper from 'modules/base/PageWrapper';
import { track } from 'config/segment';
import { SocialRadarBannerWidget } from './components/SocialRadarBannerWidget';
import { CoinRadarOnboarding } from './components/CoinRadarOnboarding';
import { HotCoinsWidget } from './components/HotCoinsWidget';

export default function PageCoinRadar() {
  useEffectOnce(() => {
    track('Feedback Coin Radar');
  });

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 gap-6">
        <SocialRadarBannerWidget />
        <HotCoinsWidget />
      </div>
      <CoinRadarOnboarding />
    </PageWrapper>
  );
}
