import useIsMobile from 'utils/useIsMobile';
import InsightPageWrapper from '../InsightPageWrapper';
import { NetworkRadarMobile } from '../../app/components/ListView/NetworkRadar/NetworkRadarCompact';
import { NetworkRadarDesktop } from '../../app/components/ListView/NetworkRadar/NetworkRadarExpanded';

const PageNetworkRadar = () => {
  const isMobile = useIsMobile();
  return (
    <InsightPageWrapper>
      {isMobile ? <NetworkRadarMobile /> : <NetworkRadarDesktop />}
    </InsightPageWrapper>
  );
};

export default PageNetworkRadar;
