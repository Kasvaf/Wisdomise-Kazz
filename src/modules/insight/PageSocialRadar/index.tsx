import PageWrapper from 'modules/base/PageWrapper';
import RadarsTabs from '../RadarsTabs';
import { HotCoinsWidget } from './components/HotCoinsWidget';

export default function PageSocialRadar() {
  return (
    <PageWrapper>
      <RadarsTabs />
      <HotCoinsWidget />
    </PageWrapper>
  );
}
