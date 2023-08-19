import useConfirm from 'modules/shared/useConfirm';
import { type Network } from '../NetworkSelector';

const useNetworkConfirm = (net: Network) =>
  useConfirm({
    yesTitle: 'Yes, I’m sure',
    noTitle: 'No, I’m not sure',
    message: (
      <>
        You have selected the <strong className="text-white">{net.name}</strong>{' '}
        network. Please confirm that your withdrawal address supports the{' '}
        <strong className="text-white">{net.description}</strong> network. If
        the receiving platform does not support it, your assets may be lost. If
        you are unsure, click the button below to verify it yourself.
      </>
    ),
  });

export default useNetworkConfirm;
