import { type ComponentProps, type FC } from 'react';
import { NetworkSelect } from 'shared/NetworkSelect';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';

const DEFAULT_NETWORK = 'solana';

export const NetworkMenu: FC<
  Omit<
    ComponentProps<typeof NetworkSelect>,
    'allowClear' | 'multiple' | 'value' | 'onChange' | 'iconOnly'
  >
> = props => {
  const [network, setNetwork] = useGlobalNetwork();

  return (
    <NetworkSelect
      {...props}
      allowClear={false}
      multiple={false}
      value={network}
      onChange={newNetwork => setNetwork(newNetwork ?? DEFAULT_NETWORK)}
      iconOnly
    />
  );
};
