import { type FC } from 'react';

export const SocialRadar: FC<{ expanded?: boolean; focus?: boolean }> = ({
  expanded,
  focus,
}) => {
  return <>{JSON.stringify({ radar: 'social-radar', focus, expanded })}</>;
};
