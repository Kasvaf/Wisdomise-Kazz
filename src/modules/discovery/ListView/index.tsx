import { WalletTracker } from 'modules/discovery/ListView/WalletTracker';
import { type FC, useEffect } from 'react';
import { type DiscoveryList, useDiscoveryBackdropParams } from '../lib';
import { CoinRadar } from './CoinRadar';
import { NetworkRadar } from './NetworkRadar';
import { Portfolio } from './Portfolio';
import { Positions } from './Positions';
import { SocialRadar } from './SocialRadar';
import { TechnicalRadar } from './TechnicalRadar';
import { WhaleRadar } from './WhaleRadar';
import { XTracker } from './XTracker';

export const ListView: FC<{
  list: DiscoveryList;
  expanded?: boolean;
  focus?: boolean;
  className?: string;
}> = ({ list, className, ...rest }) => {
  const [backdropParams, setBackdropParams] = useDiscoveryBackdropParams();
  useEffect(() => {
    if (rest.expanded && backdropParams.list !== list) {
      setBackdropParams({
        list,
      });
    }
  }, [list, rest.expanded, backdropParams.list, setBackdropParams]);
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
      ) : list === 'wallet-tracker' ? (
        <WalletTracker {...rest} />
      ) : list === 'twitter-tracker' ? (
        <XTracker {...rest} />
      ) : null}
    </div>
  );
};
