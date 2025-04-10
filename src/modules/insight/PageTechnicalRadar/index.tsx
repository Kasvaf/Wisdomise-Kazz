import useIsMobile from 'utils/useIsMobile';
import InsightPageWrapper from '../InsightPageWrapper';
import { TechnicalRadarMobile } from './components/TechnicalRadarMobile';
import { TechnicalRadarDesktop } from './components/TechnicalRadarDesktop';

const PageTechnicalRadar = () => {
  const isMobile = useIsMobile();
  return (
    <InsightPageWrapper>
      {isMobile ? <TechnicalRadarMobile /> : <TechnicalRadarDesktop />}
    </InsightPageWrapper>
  );
};

export default PageTechnicalRadar;
