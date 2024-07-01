import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import CardPageLink from 'shared/CardPageLink';
import { trackClick } from 'config/segment';
import { ReactComponent as IconSignals } from './icon-signals.svg';
import { ReactComponent as IconFP } from './icon-fp.svg';
import BuilderOnboarding from './BuilderOnboarding';

const PageBuilder = () => {
  const { t } = useTranslation('base');

  return (
    <PageWrapper>
      <BuilderOnboarding />
      <div className="mb-6 mobile:text-center">
        <h1 className="mb-3 text-3xl mobile:text-2xl">
          {t('menu.builder.title')}
        </h1>
        <p className="text-base text-white/80 mobile:text-xs">
          {t('menu.builder.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-2 items-stretch gap-6 mobile:grid-cols-1">
        <CardPageLink
          to="/builder/signalers"
          title={t('menu.signal-builder.title')}
          subtitle={t('menu.signal-builder.subtitle')}
          icon={<IconSignals />}
          height={250}
          onClick={trackClick('builder_signals_menu')}
        />

        <CardPageLink
          to="/builder/fp"
          title={t('menu.fp-builder.title')}
          subtitle={t('menu.fp-builder.subtitle')}
          icon={<IconFP />}
          height={250}
          onClick={trackClick('builder_fp_menu')}
        />
      </div>
    </PageWrapper>
  );
};

export default PageBuilder;
