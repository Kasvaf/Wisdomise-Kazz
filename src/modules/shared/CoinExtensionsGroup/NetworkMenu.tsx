import type { ComponentProps, FC } from 'react';
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
      disabled
      iconOnly
      multiple={false}
      value="solana"
    />
  );
};
