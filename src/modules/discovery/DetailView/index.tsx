import { type FC } from 'react';
import { type DETAILS } from 'modules/discovery/constants';
import { WhaleDetail } from './WhaleDetail';
import { CoinDetail } from './CoinDetail';

export const DetailView: FC<{
  detail: keyof typeof DETAILS;
  expanded?: boolean;
  focus?: boolean;
  className?: string;
}> = ({ detail, focus, expanded, className }) => {
  return (
    <div className={className}>
      {detail === 'whale' ? (
        <WhaleDetail expanded={expanded} focus={focus} />
      ) : (
        <CoinDetail expanded={expanded} focus={focus} />
      )}
    </div>
  );
};
