import { type ComponentProps, type FC } from 'react';
import { NetworkSelect } from 'shared/NetworkSelect';
import { isMiniApp } from 'utils/version';

export const NetworkMenu: FC<
  Omit<
    ComponentProps<typeof NetworkSelect>,
    'allowClear' | 'multiple' | 'value' | 'onChange' | 'iconOnly'
  >
> = props => {
  return isMiniApp ? null : (
    <NetworkSelect
      {...props}
      allowClear
      multiple={false}
      value="solana"
      disabled
      iconOnly
    />
  );
};
