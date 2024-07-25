import { useTranslation } from 'react-i18next';
import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';

export default function PageWhaleDetail() {
  const { t } = useTranslation('whale');

  return (
    <PageWrapper>
      <PageTitle
        title={t('sections.top-whales.title')}
        description={t('sections.top-whales.subtitle')}
      />
      <PageTitle
        title={t('sections.top-coins.title')}
        description={t('sections.top-coins.subtitle')}
      />
    </PageWrapper>
  );
}
