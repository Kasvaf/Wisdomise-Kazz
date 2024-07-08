import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { trackClick } from 'config/segment';
import BetaVersion from 'shared/BetaVersion';
import { PageCard } from 'shared/PageCard';
import { PageTitle } from 'shared/PageTitle';
import {
  AiIcon,
  CoinsIcon,
  InsightIcon,
  MarketplaceIcon,
  SocialMatrixIcon,
  SocialsIcon,
} from './icons';

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
          to="/insight/social-radar"
          title={t('menu.social-radar.title')}
          description={t('menu.social-radar.subtitle')}
          icon={SocialsIcon}
          onClick={trackClick('social_radar_menu')}
          badgeType="manual"
          badge={<BetaVersion />}
        />
        <PageCard
          to="/insight/marketplace"
          title={t('menu.marketplace.title')}
          description={t('menu.marketplace.subtitle')}
          icon={MarketplaceIcon}
          onClick={trackClick('marketplace_menu')}
        />
        <PageCard
          to="/insight/signals"
          title={t('menu.signal-matrix.title')}
          description={t('menu.signal-matrix.subtitle')}
          icon={SocialMatrixIcon}
          onClick={trackClick('signal_matrix_menu')}
          videoId="12CWx7r2WY8"
          badge={t('menu.signal-matrix.card-badge')}
        />
        <PageCard
          to="/insight/coins"
          title={t('menu.coin-view.title')}
          description={t('menu.coin-view.subtitle')}
          icon={CoinsIcon}
          onClick={trackClick('coin_list_menu')}
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
