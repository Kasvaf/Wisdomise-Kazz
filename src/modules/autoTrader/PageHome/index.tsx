import PageWrapper from 'modules/base/PageWrapper';
import HotCoinsTable from '../PageHotCoins/HotCoinsTable';
import Tournaments from './Tournaments';
import UserAssets from './UserAssets';

const PageHome = () => {
  return (
    <PageWrapper>
      <UserAssets className="mb-4" />
      <Tournaments />
      <HotCoinsTable />
    </PageWrapper>
  );
};

export default PageHome;
