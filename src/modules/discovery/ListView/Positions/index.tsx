import PositionsExpandable from 'modules/autoTrader/Positions/PositionsExpandable';
import type { FC } from 'react';

export const Positions: FC<{ expanded?: boolean; focus?: boolean }> = ({
  expanded,
}) => {
  return <PositionsExpandable className="p-3" expanded={expanded} />;
};
