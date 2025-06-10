import { type FC } from 'react';
import UserAssets from 'modules/autoTrader/UserAssets';

export const Portfolio: FC<{ expanded?: boolean; focus?: boolean }> = props => {
  return (
    <>
      <UserAssets
        noTotal
        className="id-assets"
        containerClassName="!p-0"
        expanded={props.expanded}
      />
    </>
  );
};
