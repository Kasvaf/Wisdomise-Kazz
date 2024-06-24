import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { trackClick } from 'config/segment';
import BetaVersion from 'shared/BetaVersion';
import { CardPageLink, CardPageLinkBadge } from 'shared/CardPageLinkV2';
import {
  AiIcon,
  CoinsIcon,
  MarketplaceIcon,
  SocialMatrixIcon,
  SocialsIcon,
} from './icons';

const PageInsight = () => {
  const { t } = useTranslation('base');

  return (
    <PageWrapper>
      <div className="mb-6 mobile:text-center">
        <h1 className="mb-3 text-3xl mobile:text-2xl">
          {t('menu.insight.title')}
        </h1>
        <p className="text-base text-white/80 mobile:text-xs">
          {t('menu.insight.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-2 items-stretch gap-6 mobile:grid-cols-1">
        <CardPageLink
          to="/insight/signals"
          title={t('menu.signal-matrix.title')}
          description={t('menu.signal-matrix.subtitle')}
          icon={SocialMatrixIcon}
          onCtaClick={trackClick('signal_matrix_menu')}
          footer={
            <CardPageLinkBadge color="purple">
              {t('menu.signal-matrix.card-badge')}
            </CardPageLinkBadge>
          }
        />
        <CardPageLink
          to="/insight/coins"
          title={t('menu.coin-view.title')}
          description={t('menu.coin-view.subtitle')}
          icon={CoinsIcon}
          onCtaClick={trackClick('coin_list_menu')}
        />
        <CardPageLink
          to="/insight/marketplace"
          title={t('menu.marketplace.title')}
          description={t('menu.marketplace.subtitle')}
          icon={MarketplaceIcon}
          onCtaClick={trackClick('marketplace_menu')}
        />

        <CardPageLink
          to="/insight/athena"
          title={t('menu.athena.title')}
          description={t('menu.athena.subtitle')}
          icon={AiIcon}
          onCtaClick={trackClick('crypto_chatbot_menu')}
          footer={
            <CardPageLinkBadge color="purple">
              {t('menu.athena.features')}
            </CardPageLinkBadge>
          }
        />
        <CardPageLink
          to="/insight/social-radar"
          title={t('menu.social-radar.title')}
          description={t('menu.social-radar.subtitle')}
          icon={SocialsIcon}
          onCtaClick={trackClick('social_radar_menu')}
          footer={<BetaVersion />}
        />
      </div>
    </PageWrapper>
  );
};

export default PageInsight;
