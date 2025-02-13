import PageWrapper from 'modules/base/PageWrapper';
import useIsMobile from 'utils/useIsMobile';
import { WhaleRadarDesktop } from './components/WhaleRadarDesktop';
import { WhaleRadarMobile } from './components/WhaleRadarMobile';

const PageWhaleRadar = () => {
  const isMobile = useIsMobile();
  return (
    <PageWrapper>
      {isMobile ? <WhaleRadarMobile /> : <WhaleRadarDesktop />}
    </PageWrapper>
  );
};

export default PageWhaleRadar;
