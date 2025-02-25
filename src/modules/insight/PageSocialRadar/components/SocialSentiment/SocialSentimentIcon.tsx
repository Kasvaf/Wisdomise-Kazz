import { type FC } from 'react';
import { clsx } from 'clsx';
import { type SocialRadarSentiment } from 'api';
import Happy from './happy.png';
import Sad from './sad.png';

export const SocialSentimentIcon: FC<{
  value?: SocialRadarSentiment['gauge_tag'];
  className?: string;
}> = ({ value, className }) => (
  <img
    width={64}
    height={64}
    src={value === 'LONG' ? Happy : value === 'SHORT' ? Sad : Happy}
    className={clsx(
      'object-contain',
      value !== 'LONG' && value !== 'SHORT' && 'grayscale',
      className,
    )}
  />
);
