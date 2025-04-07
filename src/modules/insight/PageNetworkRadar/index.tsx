import useIsMobile from 'utils/useIsMobile';
import PageWrapper from 'modules/base/PageWrapper';
import { NetworkRadarMobile } from './components/NetworkRadarMobile';
import { NetworkRadarDesktop } from './components/NetworkRadarDesktop';

const PageNetworkRadar = () => {
  const isMobile = useIsMobile();
  return (
    <PageWrapper>
      {isMobile ? <NetworkRadarMobile /> : <NetworkRadarDesktop />}
    </PageWrapper>
  );
};

export default PageNetworkRadar;
