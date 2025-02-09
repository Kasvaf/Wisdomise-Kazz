import PageWrapper from 'modules/base/PageWrapper';
import useIsMobile from 'utils/useIsMobile';
import HotCoinsTable from '../../autoTrader/PageHotCoins/HotCoinsTable';
import PageInsight from '../PageInsight';
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
