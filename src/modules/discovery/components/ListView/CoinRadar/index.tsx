import { type FC } from 'react';

export const CoinRadar: FC<{ expanded?: boolean; focus?: boolean }> = ({
  expanded,
  focus,
}) => {
  return <>{JSON.stringify({ radar: 'coin-radar', focus, expanded })}</>;
};
