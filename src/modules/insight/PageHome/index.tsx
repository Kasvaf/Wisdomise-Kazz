import PageWrapper from 'modules/base/PageWrapper';
import { PageCoinRadarMeta } from './components/PageCoinRadarMeta';
import { HomeDesktop } from './components/HomeDesktop';

const PageHome = () => {
  return (
    <PageWrapper>
      <PageCoinRadarMeta />
      <HomeDesktop />
    </PageWrapper>
  );
};

export default PageHome;
