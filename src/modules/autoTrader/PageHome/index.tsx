import PageWrapper from 'modules/base/PageWrapper';
import HotCoinsTable from '../PageHotCoins/HotCoinsTable';
import Tournaments from './Tournaments';

const PageHome = () => {
  return (
    <PageWrapper>
      <Tournaments />
      <HotCoinsTable />
    </PageWrapper>
  );
};

export default PageHome;
