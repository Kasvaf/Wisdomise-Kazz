import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { trackClick } from 'config/segment';
import BetaVersion from 'shared/BetaVersion';
import { PageCard } from 'shared/PageCard';
import { PageTitle } from 'shared/PageTitle';
import { AiIcon, InsightIcon, SocialsIcon, MarketPulseIcon } from './icons';

const PageInsight = () => {
  const { t } = useTranslation('base');

  return (
    <PageWrapper>
      <PageTitle
        icon={InsightIcon}
        title={t('menu.insight.title')}
        description={t('menu.insight.subtitle')}
        className="mb-10"
      />

      <div className="grid grid-cols-2 items-stretch gap-6 mobile:grid-cols-1">
        <PageCard
          to="/insight/coin-radar"
          title={t('menu.coin-radar.title')}
          description={t('menu.coin-radar.subtitle')}
          icon={SocialsIcon}
          onClick={trackClick('coin_radar_menu')}
          badgeType="manual"
          badge={<BetaVersion />}
        />
        <PageCard
          to="/insight/market-pulse"
          title={t('menu.market-pulse.title')}
          description={t('menu.market-pulse.subtitle')}
          icon={MarketPulseIcon}
          onClick={trackClick('market_pulse_menu')}
          badgeType="manual"
          badge={<BetaVersion />}
        />
        <PageCard
          to="/insight/athena"
          title={t('menu.athena.title')}
          description={t('menu.athena.subtitle')}
          icon={AiIcon}
          onClick={trackClick('crypto_chatbot_menu')}
          badge={t('menu.athena.features')}
        />
      </div>
    </PageWrapper>
  );
};

export default PageInsight;
