import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import CardPageLink from 'modules/shared/CardPageLink';
import { ReactComponent as IconSignals } from './icon-signals.svg';
import { ReactComponent as IconAthena } from './icon-athena.svg';

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
        />

        <CardPageLink
          to="https://landing.wisdomise.com/athena"
          title={t('menu.athena.title')}
          subtitle={t('menu.athena.subtitle')}
          icon={<IconAthena />}
          height={250}
        >
          <div className="text-2xl font-medium mobile:text-xl">
            {t('menu.athena.features')}
          </div>
        </CardPageLink>
      </div>
    </PageWrapper>
  );
};

export default PageInsight;
