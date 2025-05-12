import { WhaleRadarCoinsWidget } from './WhaleRadarCoinsWidget';
import { WhaleRadarWhalesWidget } from './WhaleRadarWhalesWidget';

export function WhaleRadarExpanded() {
  return (
    <div className="flex flex-col gap-6">
      <WhaleRadarCoinsWidget />
      <WhaleRadarWhalesWidget />
    </div>
  );
}
