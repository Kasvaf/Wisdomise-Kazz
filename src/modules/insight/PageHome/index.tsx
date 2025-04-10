import useIsMobile from 'utils/useIsMobile';
import InsightPageWrapper from '../InsightPageWrapper';
import { HomeMobile } from './components/HomeMobile';
import { HomeDesktop } from './components/HomeDesktop';
import { PageCoinRadarMeta } from './components/PageCoinRadarMeta';

const PageHome = () => {
  const isMobile = useIsMobile();
  return (
    <InsightPageWrapper>
      <PageCoinRadarMeta />
      {isMobile ? <HomeMobile /> : <HomeDesktop />}
    </InsightPageWrapper>
  );
};

export default PageHome;
