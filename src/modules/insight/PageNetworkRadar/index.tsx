import useIsMobile from 'utils/useIsMobile';
import PageWrapper from 'modules/base/PageWrapper';
import { NetworkRadarMobile } from './components/NetworkRadarMobile';

const PageNetworkRadar = () => {
  const isMobile = useIsMobile();
  return (
    <PageWrapper>{isMobile ? <NetworkRadarMobile /> : <>TODO</>}</PageWrapper>
  );
};

export default PageNetworkRadar;
