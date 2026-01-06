import type { DiscoveryDetail } from 'modules/discovery/lib';
import type { FC } from 'react';
import { CoinDetail } from './CoinDetail';

export const DetailView: FC<{
  detail: DiscoveryDetail;
  expanded?: boolean;
  focus?: boolean;
  className?: string;
}> = ({ focus, expanded, className }) => {
  return (
    <div className={`${className} max-md:h-full max-md:overflow-hidden`}>
      <CoinDetail expanded={expanded} focus={focus} />
    </div>
  );
};
