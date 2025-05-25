import { type FC } from 'react';
import PositionsCompact from 'modules/autoTrader/PagePositions/PositionsCompact';

export const Positions: FC<{ expanded?: boolean; focus?: boolean }> = () => {
  return <PositionsCompact />;
};
