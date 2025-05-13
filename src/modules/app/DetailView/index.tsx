import { type FC } from 'react';
import { type AVAILABLE_DETAILS } from 'modules/app/constants';
import { WhaleDetail } from './WhaleDetail';
import { CoinDetail } from './CoinDetail';

export const DetailView: FC<{
  detail: (typeof AVAILABLE_DETAILS)[number];
  slug?: string;
  expanded?: boolean;
  focus?: boolean;
  className?: string;
}> = ({ detail, slug, focus, expanded, className }) => {
  return (
    <div className={className}>
      {slug ? (
        detail === 'whale' ? (
          <WhaleDetail expanded={expanded} focus={focus} slug={slug} />
        ) : (
          <CoinDetail expanded={expanded} focus={focus} slug={slug} />
        )
      ) : (
        'Empty'
      )}
    </div>
  );
};
