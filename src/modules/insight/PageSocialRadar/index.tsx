import useIsMobile from 'utils/useIsMobile';
import PageWrapper from 'modules/base/PageWrapper';
import { SocialRadarMobile } from './components/SocialRadarMobile';
import { SocialRadarDesktop } from './components/SocialRadarDesktop';

const PageSocialRadar = () => {
  const isMobile = useIsMobile();
  return (
    <PageWrapper>
      {isMobile ? <SocialRadarMobile /> : <SocialRadarDesktop />}
    </PageWrapper>
  );
};

export default PageSocialRadar;
