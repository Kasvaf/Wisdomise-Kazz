import { type FC } from 'react';
import PositionsExpandable from 'modules/autoTrader/Positions/PositionsExpandable';

export const Positions: FC<{ expanded?: boolean; focus?: boolean }> = ({
  expanded,
}) => {
  return <PositionsExpandable expanded={expanded} className="p-3" />;
};
