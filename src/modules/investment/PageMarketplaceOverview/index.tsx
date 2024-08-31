import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import SectionSignals from './SectionSignals';

const PageMarketplaceOverview = () => {
  // const { t } = useTranslation();

  return (
    <PageWrapper>
      <PageTitle
        title="Automation Trading and Passive Income Solutions"
        description="Explore the range of financial products and strategy builders designed to automate your trading journey."
      />

      <SectionSignals className="mt-6" />
    </PageWrapper>
  );
};

export default PageMarketplaceOverview;
