import { type FC } from 'react';

export const WhaleDetail: FC<{
  slug: string;
  expanded?: boolean;
  focus?: boolean;
}> = ({ slug, expanded, focus }) => {
  return <>{JSON.stringify({ detail: 'whale', slug, focus, expanded })}</>;
};
