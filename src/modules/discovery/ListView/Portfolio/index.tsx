import { type FC } from 'react';
import UserPortfolio from 'modules/autoTrader/UserAssets';

export const Portfolio: FC<{ expanded?: boolean; focus?: boolean }> = props => {
  return <UserPortfolio expanded={props.expanded} />;
};
