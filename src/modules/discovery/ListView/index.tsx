import { type FC } from 'react';
import { type AVAILABLE_LISTS } from 'modules/discovery/constants';
import { Positions } from 'modules/discovery/ListView/Positions';
import { SocialRadar } from './SocialRadar';
import { WhaleRadar } from './WhaleRadar';
import { TechnicalRadar } from './TechnicalRadar';
import { NetworkRadar } from './NetworkRadar';
import { CoinRadar } from './CoinRadar';
import { Portfolio } from './Portfolio';
import { TwitterTracker } from './TwitterTracker';

export const ListView: FC<{
  list: (typeof AVAILABLE_LISTS)[number];
  expanded?: boolean;
  focus?: boolean;
  className?: string;
}> = ({ list, className, ...rest }) => {
  return (
    <div id="app-list" className={className}>
      {list === 'social-radar' ? (
        <SocialRadar {...rest} />
      ) : list === 'whale-radar' ? (
        <WhaleRadar {...rest} />
      ) : list === 'technical-radar' ? (
        <TechnicalRadar {...rest} />
      ) : list === 'network-radar' ? (
        <NetworkRadar {...rest} />
      ) : list === 'coin-radar' ? (
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
