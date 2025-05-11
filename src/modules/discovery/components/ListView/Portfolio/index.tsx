import { type FC } from 'react';

export const Portfolio: FC<{ expanded?: boolean; focus?: boolean }> = ({
  expanded,
  focus,
}) => {
  return <>{JSON.stringify({ radar: 'portfolio', focus, expanded })}</>;
};
