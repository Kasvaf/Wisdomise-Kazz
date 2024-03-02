import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import CardPageLink from 'shared/CardPageLink';
import { trackClick } from 'config/segment';
import BetaVersion from 'shared/BetaVersion';
import { ReactComponent as IconSignals } from './icon-signals.svg';
import { ReactComponent as IconAthena } from './icon-athena.svg';
import { ReactComponent as IconSocialRardar } from './icon-social-radar.svg';

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
          subtitle={t('menu.signal-matrix.subtitle')}
          icon={<IconSignals />}
          height={250}
          onClick={trackClick('signal_matrix_menu')}
        />

        <CardPageLink
          to="/insight/coins"
          title={t('menu.coin-view.title')}
          subtitle={t('menu.coin-view.subtitle')}
          icon={<IconSignals />}
          height={250}
          onClick={trackClick('coin_list_menu')}
        />

        <CardPageLink
          to="/insight/athena"
          title={t('menu.athena.title')}
          subtitle={t('menu.athena.subtitle')}
          icon={<IconAthena />}
          height={250}
          onClick={trackClick('crypto_chatbot_menu')}
        >
          <div className="text-2xl font-medium mobile:text-xl">
            {t('menu.athena.features')}
          </div>
        </CardPageLink>

        <CardPageLink
          to="/insight/social-radar"
          title={t('menu.social-radar.title')}
          subtitle={t('menu.social-radar.subtitle')}
          icon={<IconSocialRardar />}
          height={250}
          onClick={trackClick('crypto_chatbot_menu')}
        >
          <BetaVersion />
        </CardPageLink>
      </div>
    </PageWrapper>
  );
};

export default PageInsight;
