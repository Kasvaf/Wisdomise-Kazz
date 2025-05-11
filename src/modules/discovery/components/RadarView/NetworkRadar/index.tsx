import { type FC } from 'react';

export const NetworkRadar: FC<{ expanded?: boolean; focus?: boolean }> = ({
  expanded,
  focus,
}) => {
  return <>{JSON.stringify({ radar: 'network-radar', focus, expanded })}</>;
};
