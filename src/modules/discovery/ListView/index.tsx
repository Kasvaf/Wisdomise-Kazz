import type { FC } from 'react';
import type { DiscoveryList } from '../lib';
import { CoinRadar } from './CoinRadar';
import { NetworkRadar } from './NetworkRadar';
import { Portfolio } from './Portfolio';
import { Positions } from './Positions';
import { SocialRadar } from './SocialRadar';
import { TechnicalRadar } from './TechnicalRadar';
import { TwitterTracker } from './TwitterTracker';
import { WhaleRadar } from './WhaleRadar';

export const ListView: FC<{
  list: DiscoveryList;
  expanded?: boolean;
  focus?: boolean;
  className?: string;
}> = ({ list, className, ...rest }) => {
  return (
    <div className={className} id="app-list">
      {list === 'social-radar' ? (
        <SocialRadar {...rest} />
      ) : list === 'whale-radar' ? (
        <WhaleRadar {...rest} />
      ) : list === 'technical-radar' ? (
        <TechnicalRadar {...rest} />
      ) : list === 'trench' ? (
        <NetworkRadar {...rest} />
      ) : list === 'bluechips' ? (
        <CoinRadar {...rest} />
      ) : list === 'portfolio' ? (
        <Portfolio {...rest} />
      ) : list === 'positions' ? (
        <Positions {...rest} />
      ) : list === 'twitter-tracker' ? (
        <TwitterTracker {...rest} />
      ) : null}
    </div>
  );
};
