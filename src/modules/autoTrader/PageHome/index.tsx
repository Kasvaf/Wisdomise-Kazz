import PageWrapper from 'modules/base/PageWrapper';
import HotCoinsTable from '../PageHotCoins/HotCoinsTable';
import UserAssets from './UserAssets';

const PageHome = () => {
  return (
    <PageWrapper>
      <UserAssets className="mb-4" />
      <HotCoinsTable />
    </PageWrapper>
  );
};

export default PageHome;
