import { type ComponentProps, type FC } from 'react';
import { NetworkSelect } from 'shared/NetworkSelect';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { isMiniApp } from 'utils/version';

export const NetworkMenu: FC<
  Omit<
    ComponentProps<typeof NetworkSelect>,
    'allowClear' | 'multiple' | 'value' | 'onChange' | 'iconOnly'
  >
> = props => {
  const [network, setNetwork] = useGlobalNetwork();

  return isMiniApp ? null : (
    <NetworkSelect
      {...props}
      allowClear
      multiple={false}
      value={network}
      onChange={newNetwork => setNetwork(newNetwork)}
      iconOnly
    />
  );
};
