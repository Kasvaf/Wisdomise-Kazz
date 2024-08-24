import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { trackClick } from 'config/segment';
import BetaVersion from 'shared/BetaVersion';
import { PageCard } from 'shared/PageCard';
import { PageTitle } from 'shared/PageTitle';
import { InsightIcon, SocialsIcon, MarketPulseIcon, WhaleIcon } from './icons';

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
        />
        <PageCard
          to="/insight/market-pulse"
          title={t('menu.market-pulse.title')}
          description={t('menu.market-pulse.subtitle')}
          icon={MarketPulseIcon}
          onClick={trackClick('market_pulse_menu')}
          badgeType="manual"
          badge={<BetaVersion variant="new" />}
        />
        <PageCard
          to="/insight/whales"
          title={t('menu.whales.title')}
          description={t('menu.whales.subtitle')}
          icon={WhaleIcon}
          onClick={trackClick('whales_menu')}
          badgeType="manual"
          badge={<BetaVersion />}
        />
      </div>
    </PageWrapper>
  );
};

export default PageInsight;
