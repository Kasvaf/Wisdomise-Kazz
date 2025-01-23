import PageWrapper from 'modules/base/PageWrapper';
import HotCoinsTable from '../PageHotCoins/HotCoinsTable';
import DailyTradeQuest from './DailyTradeQuest';
import Tournaments from './Tournaments';
import UserAssets from './UserAssets';

const PageHome = () => {
  return (
    <PageWrapper>
      <UserAssets className="mb-4" />
      <DailyTradeQuest />
      <Tournaments />
      <HotCoinsTable />
    </PageWrapper>
  );
};

export default PageHome;
