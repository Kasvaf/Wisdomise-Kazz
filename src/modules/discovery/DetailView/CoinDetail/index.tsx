import { type FC } from 'react';

import { CoinDetailsExpanded } from './CoinDetailsExpanded';
import { CoinDetailsCompact } from './CoinDetailsCompact';
import { CoinDetailsMeta } from './CoinDetailsMeta';

export const CoinDetail: FC<{
  slug: string;
  expanded?: boolean;
  focus?: boolean;
}> = ({ slug, expanded, focus }) => {
  return (
    <>
      {focus && <CoinDetailsMeta slug={slug} />}
      {expanded ? (
        <CoinDetailsExpanded slug={slug} />
      ) : (
        <CoinDetailsCompact slug={slug} />
      )}
    </>
  );
};
