import { type FC } from 'react';
import { type AVAILABLE_RADARS } from 'modules/discovery/lib';
import { SocialRadar } from './SocialRadar';
import { WhaleRadar } from './WhaleRadar';
import { TechnicalRadar } from './TechnicalRadar';
import { NetworkRadar } from './NetworkRadar';
import { CoinRadar } from './CoinRadar';

export const RadarView: FC<{
  radar: (typeof AVAILABLE_RADARS)[number];
  expanded?: boolean;
  focus?: boolean;
}> = ({ radar, focus, expanded }) => {
  return (
    <>
      {radar === 'social' ? (
        <SocialRadar expanded={expanded} focus={focus} />
      ) : radar === 'whale' ? (
        <WhaleRadar expanded={expanded} focus={focus} />
      ) : radar === 'technical' ? (
        <TechnicalRadar expanded={expanded} focus={focus} />
      ) : radar === 'network' ? (
        <NetworkRadar expanded={expanded} focus={focus} />
      ) : (
        <CoinRadar expanded={expanded} focus={focus} />
      )}
    </>
  );
};
