import { type FC } from 'react';

export const WhaleRadar: FC<{ expanded?: boolean; focus?: boolean }> = ({
  expanded,
  focus,
}) => {
  return <>{JSON.stringify({ radar: 'whale-radar', focus, expanded })}</>;
};
