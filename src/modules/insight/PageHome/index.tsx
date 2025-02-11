import useIsMobile from 'utils/useIsMobile';
import PageWrapper from 'modules/base/PageWrapper';
import { HomeMobile } from './components/HomeMobile';
import { HomeDesktop } from './components/HomeDesktop';
import { PageCoinRadarMeta } from './components/PageCoinRadarMeta';

const PageHome = () => {
  const isMobile = useIsMobile();
  return (
    <PageWrapper>
      <PageCoinRadarMeta />
      {isMobile ? <HomeMobile /> : <HomeDesktop />}
    </PageWrapper>
  );
};

export default PageHome;
