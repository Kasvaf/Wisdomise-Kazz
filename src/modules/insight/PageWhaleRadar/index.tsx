import PageWrapper from 'modules/base/PageWrapper';
import { WhaleRadarWhalesWidget } from './components/WhaleRadarWhalesWidget';
import { WhaleRadarCoinsWidget } from './components/WhaleRadarCoinsWidget';

export default function PageWhaleRadar() {
  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <WhaleRadarCoinsWidget />
        <WhaleRadarWhalesWidget />
      </div>
    </PageWrapper>
  );
}
