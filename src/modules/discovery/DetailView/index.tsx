import WalletDetail from 'modules/base/wallet/WalletDetail';
import type { DiscoveryDetail } from 'modules/discovery/lib';
import type { FC } from 'react';
import { CoinDetail } from './CoinDetail';
import { WhaleDetail } from './WhaleDetail';

export const DetailView: FC<{
  detail: DiscoveryDetail;
  expanded?: boolean;
  focus?: boolean;
  className?: string;
}> = ({ detail, focus, expanded, className }) => {
  return (
    <div className={className}>
      {detail === 'wallet' ? (
        <WalletDetail expanded={expanded} focus={focus} />
      ) : detail === 'whale' ? (
        <WhaleDetail expanded={expanded} focus={focus} />
      ) : (
        <CoinDetail expanded={expanded} focus={focus} />
      )}
    </div>
  );
};
