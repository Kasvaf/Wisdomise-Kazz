import useIsMobile from 'utils/useIsMobile';
import InsightPageWrapper from '../InsightPageWrapper';
import { SocialRadarMobile } from './components/SocialRadarMobile';
import { SocialRadarDesktop } from './components/SocialRadarDesktop';

const PageSocialRadar = () => {
  const isMobile = useIsMobile();
  return (
    <InsightPageWrapper>
      {isMobile ? <SocialRadarMobile /> : <SocialRadarDesktop />}
    </InsightPageWrapper>
  );
};

export default PageSocialRadar;
