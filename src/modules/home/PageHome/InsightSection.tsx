import { useTranslation } from 'react-i18next';
import { PageTitle } from 'shared/PageTitle';
import { PageCard } from 'shared/PageCard';
import { trackClick } from 'config/segment';
import { ReactComponent as InsightIcon } from './icon/insight.svg';
import { ReactComponent as SignalMatrixIcon } from './icon/signalMatrix.svg';
import { ReactComponent as CoinRadarIcon } from './icon/coinRadar.svg';

export default function InsightSection() {
  const { t } = useTranslation('home');

  return (
    <section className="mt-12">
      <PageTitle
        icon={InsightIcon}
        title={t('insight.title')}
        description={t('insight.subtitle')}
      />

      <section className="mt-8 grid grid-cols-3 gap-4 mobile:grid-cols-1">
        <PageCard
          to="/insight/signalers"
          videoId="12CWx7r2WY8"
          title={t('insight.signals.title')}
          icon={SignalMatrixIcon}
          badge={t('insight.signals.tag')}
          onClick={trackClick('onboarding_signal_matrix')}
          description={t('insight.signals.description')}
        />
        <PageCard
          title={t('insight.coin-radar.title')}
          icon={CoinRadarIcon}
          to="/insight/coin-radar"
          onClick={trackClick('onboarding_coin_radar')}
          info={t('insight.coin-radar.info')}
          description={t('insight.coin-radar.description')}
        />
      </section>
    </section>
  );
}
