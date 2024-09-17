import PageWrapper from 'modules/base/PageWrapper';
import { PageTitle } from 'shared/PageTitle';
import SectionSignals from './SectionSignals';
import SectionProducts from './SectionProducts';
import SectionBuilder from './SectionBuilder';

const PageMarketplaceOverview = () => {
  // const { t } = useTranslation();

  return (
    <PageWrapper>
      <PageTitle
        title="Automation Trading and Passive Income Solutions"
        description="Explore the range of financial products and strategy builders designed to automate your trading journey."
      />

      <div className="mt-6 flex items-stretch gap-6 mobile:flex-col-reverse">
        <SectionProducts className="grow" />
        <SectionBuilder className="h-[510px] w-[363px] shrink-0 mobile:h-[460px] mobile:w-full" />
      </div>
      <SectionSignals className="mt-6" />
    </PageWrapper>
  );
};

export default PageMarketplaceOverview;
