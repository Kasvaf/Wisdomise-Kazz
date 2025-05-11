import { type FC } from 'react';
import { type AVAILABLE_LISTS } from 'modules/discovery/lib';
import { SocialRadar } from './SocialRadar';
import { WhaleRadar } from './WhaleRadar';
import { TechnicalRadar } from './TechnicalRadar';
import { NetworkRadar } from './NetworkRadar';
import { CoinRadar } from './CoinRadar';
import { Portfolio } from './Portfolio';

export const ListView: FC<{
  list: (typeof AVAILABLE_LISTS)[number];
  expanded?: boolean;
  focus?: boolean;
  className?: string;
}> = ({ list, className, ...rest }) => {
  return (
    <div className={className}>
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
      ) : null}
    </div>
  );
};
