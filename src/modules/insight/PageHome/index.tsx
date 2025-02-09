import PageWrapper from 'modules/base/PageWrapper';
import useIsMobile from 'utils/useIsMobile';
import PageInsight from '../PageInsight';
import HotCoinsTable from './HotCoinsTable';
import UserAssets from './UserAssets';

const PageHome = () => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <PageWrapper>
      <UserAssets className="mb-4" />
      <HotCoinsTable />
    </PageWrapper>
  ) : (
    <PageInsight />
  );
};

export default PageHome;
