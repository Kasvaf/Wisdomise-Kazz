import UserPortfolio from 'modules/autoTrader/UserAssets';
import type { FC } from 'react';

export const Portfolio: FC<{ expanded?: boolean; focus?: boolean }> = props => {
  return <UserPortfolio expanded={props.expanded} />;
};
