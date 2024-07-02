import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { trackClick } from 'config/segment';
import { PageCard } from 'shared/PageCard';
import { PageTitle } from 'shared/PageTitle';
import { ReactComponent as IconSignals } from './icon-signals.svg';
import { ReactComponent as IconFP } from './icon-fp.svg';
import { ReactComponent as BuilderIcon } from './builder-empty.svg';

const PageBuilder = () => {
  const { t } = useTranslation('base');

  return (
    <PageWrapper>
      <PageTitle
        className="mb-10"
        icon={BuilderIcon}
        title={t('menu.builder.title')}
        description={t('menu.builder.subtitle')}
      />

      <div className="grid grid-cols-2 gap-6 mobile:grid-cols-1">
        <PageCard
          to="/builder/signalers"
          title={t('menu.signal-builder.title')}
          description={t('menu.signal-builder.subtitle')}
          icon={IconSignals}
          onClick={trackClick('builder_signals_menu')}
          cta={t('menu.signal-builder.card-button')}
        />

        <PageCard
          to="/builder/fp"
          title={t('menu.fp-builder.title')}
          description={t('menu.fp-builder.subtitle')}
          icon={IconFP}
          onClick={trackClick('builder_fp_menu')}
          cta={t('menu.fp-builder.card-button')}
          badge={t('menu.fp-builder.card-badge')}
        />
      </div>
    </PageWrapper>
  );
};

export default PageBuilder;
