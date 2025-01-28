import PageWrapper from 'modules/base/PageWrapper';
import { useHasFlag } from 'api';
import HotCoinsTable from '../PageHotCoins/HotCoinsTable';
import DailyTradeQuest from './DailyTradeQuest';
import Tournaments from './Tournaments';
import UserAssets from './UserAssets';

const PageHome = () => {
  const hasFlag = useHasFlag();
  return (
    <PageWrapper>
      <UserAssets className="mb-4" />
      {hasFlag('/trader-quests') && <DailyTradeQuest />}
      <Tournaments />
      <HotCoinsTable />
    </PageWrapper>
  );
};

export default PageHome;
