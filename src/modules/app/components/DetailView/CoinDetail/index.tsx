import { type FC } from 'react';

export const CoinDetail: FC<{
  slug: string;
  expanded?: boolean;
  focus?: boolean;
}> = ({ slug, expanded, focus }) => {
  return <>{JSON.stringify({ detail: 'coin', slug, focus, expanded })}</>;
};
