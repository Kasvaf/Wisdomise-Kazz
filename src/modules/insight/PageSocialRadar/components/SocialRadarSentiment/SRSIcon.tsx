import { type FC } from 'react';
import { clsx } from 'clsx';
import { type SocialRadarSentiment } from 'api';
import Happy from './happy.png';
import Sad from './sad.png';

export const SRSIcon: FC<{
  value?: SocialRadarSentiment['gauge_tag'];
  className?: string;
}> = ({ value, className }) => (
  <img
    width={64}
    height={64}
    src={value === 'LONG' ? Happy : value === 'SHORT' ? Sad : Happy}
    className={clsx(
      'object-contain',
      value === 'NEUTRAL' && 'grayscale',
      value !== 'NEUTRAL' &&
        value !== 'LONG' &&
        value !== 'SHORT' &&
        'opacity-80',
      className,
    )}
  />
);
