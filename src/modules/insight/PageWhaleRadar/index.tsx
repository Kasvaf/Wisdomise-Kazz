import useIsMobile from 'utils/useIsMobile';
import InsightPageWrapper from '../InsightPageWrapper';
import { WhaleRadarDesktop } from './components/WhaleRadarDesktop';
import { WhaleRadarMobile } from './components/WhaleRadarMobile';

const PageWhaleRadar = () => {
  const isMobile = useIsMobile();
  return (
    <InsightPageWrapper>
      {isMobile ? <WhaleRadarMobile /> : <WhaleRadarDesktop />}
    </InsightPageWrapper>
  );
};

export default PageWhaleRadar;
