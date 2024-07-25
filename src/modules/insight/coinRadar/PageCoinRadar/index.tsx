import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'usehooks-ts';
import PageWrapper from 'modules/base/PageWrapper';
import { useCoinSignals, useMarketInfoFromSignals } from 'api';
import { track } from 'config/segment';
import SetNotification from './SetNotification';
import { HotCoins } from './HotCoins';
import { HotCoinsBanner } from './HotCoinsBanner';
import { TopSignals } from './TopSignals';
import { CoinRadarOnboarding } from './SocialRadarOnboarding';

export default function PageCoinRadar() {
  const signals = useCoinSignals({
    meta: {
      windowHours: 24,
    },
  });
  const { t } = useTranslation('coin-radar');
  const marketInfo = useMarketInfoFromSignals();

  useEffectOnce(() => {
    track('Feedback Coin Radar');
  });

  return (
    <PageWrapper
      className="leading-none mobile:leading-normal"
      loading={marketInfo.isLoading || signals.isLoading}
    >
      <div className="mb-10 grid grid-cols-2 items-center gap-10 mobile:mb-4 mobile:gap-6 mobile:pt-4">
        <HotCoinsBanner className="col-span-full h-auto w-full mobile:order-2" />
        <h2 className="text-xl font-semibold mobile:order-3">
          {t('hot-coins-section.title')}
        </h2>
        <div className="flex items-center justify-end mobile:order-1 mobile:col-span-full mobile:justify-stretch">
          <SetNotification className="mobile:!w-full" />
        </div>
      </div>
      <HotCoins className="mb-10" />
      <div className="grid grid-cols-2 gap-8 mobile:grid-cols-1">
        <TopSignals signalType="gainer" />
        <TopSignals signalType="loser" />
      </div>
      <CoinRadarOnboarding />
    </PageWrapper>
  );
}
