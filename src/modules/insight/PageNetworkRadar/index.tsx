import useIsMobile from 'utils/useIsMobile';
import InsightPageWrapper from '../InsightPageWrapper';
import { NetworkRadarMobile } from './components/NetworkRadarMobile';
import { NetworkRadarDesktop } from './components/NetworkRadarDesktop';

const PageNetworkRadar = () => {
  const isMobile = useIsMobile();
  return (
    <InsightPageWrapper>
      {isMobile ? <NetworkRadarMobile /> : <NetworkRadarDesktop />}
    </InsightPageWrapper>
  );
};

export default PageNetworkRadar;
