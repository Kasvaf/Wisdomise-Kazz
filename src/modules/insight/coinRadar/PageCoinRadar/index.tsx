import { useEffectOnce } from 'usehooks-ts';
import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { track } from 'config/segment';
import { PageTitle } from 'shared/PageTitle';
import { CoinRadarOnboarding } from './components/CoinRadarOnboarding';
import { HotCoinsWidget } from './components/HotCoinsWidget';
import { ReactComponent as Realtime } from './realtime.svg';

export default function PageCoinRadar() {
  const { t } = useTranslation('coin-radar');
  useEffectOnce(() => {
    track('Feedback Coin Radar');
  });

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 gap-6">
        <PageTitle
          title={
            <>
              {t('social-radar.banner.title')}
              <Realtime />
            </>
          }
          description={t('social-radar.banner.subtitle')}
        />
        <HotCoinsWidget />
      </div>
      <CoinRadarOnboarding />
    </PageWrapper>
  );
}
