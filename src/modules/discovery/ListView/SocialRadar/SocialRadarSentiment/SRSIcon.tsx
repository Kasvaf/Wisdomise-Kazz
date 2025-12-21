import { clsx } from 'clsx';
import type { FC } from 'react';
import type { SocialRadarSentiment } from 'services/rest/discovery';
import Happy from './happy.png';
import Sad from './sad.png';

export const SRSIcon: FC<{
  value?: SocialRadarSentiment['gauge_tag'];
  className?: string;
}> = ({ value, className }) => (
  <img
    className={clsx(
      'object-contain',
      value === 'NEUTRAL' && 'grayscale',
      value !== 'NEUTRAL' &&
        value !== 'LONG' &&
        value !== 'SHORT' &&
        'opacity-80',
      className,
    )}
    height={64}
    src={value === 'LONG' ? Happy : value === 'SHORT' ? Sad : Happy}
    width={64}
  />
);
