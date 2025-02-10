import PageWrapper from 'modules/base/PageWrapper';
import useIsMobile from 'utils/useIsMobile';
import PageInsight from '../PageInsight';
import { HomeMobile } from './components/HomeMobile';

const PageHome = () => {
  const isMobile = useIsMobile();
  return isMobile ? (
    <PageWrapper>
      <HomeMobile />
    </PageWrapper>
  ) : (
    <PageInsight />
  );
};

export default PageHome;
