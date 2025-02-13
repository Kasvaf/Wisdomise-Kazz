import useIsMobile from 'utils/useIsMobile';
import PageWrapper from 'modules/base/PageWrapper';
import { TechnicalRadarMobile } from './components/TechnicalRadarMobile';
import { TechnicalRadarDesktop } from './components/TechnicalRadarDesktop';

const PageTechnicalRadar = () => {
  const isMobile = useIsMobile();
  return (
    <PageWrapper>
      {isMobile ? <TechnicalRadarMobile /> : <TechnicalRadarDesktop />}
    </PageWrapper>
  );
};

export default PageTechnicalRadar;
