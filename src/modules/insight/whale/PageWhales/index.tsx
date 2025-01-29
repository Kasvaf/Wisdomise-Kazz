import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import { WhaleTopHoldersWidget } from './components/WhaleTopHoldersWidget';
import { WhaleTopCoinsWidget } from './components/WhaleTopCoinsWidget';

export default function PageWhales() {
  const { t } = useTranslation('base');
  return (
    <PageWrapper>
      <div className="grid grid-cols-2 gap-6">
        <PageTitle
          title={t('menu.whales.full-title')}
          description={t('menu.whales.subtitle')}
          className="col-span-2"
        />
        <WhaleTopCoinsWidget className="col-span-2" />
        <WhaleTopHoldersWidget className="col-span-2" />
      </div>
    </PageWrapper>
  );
}
