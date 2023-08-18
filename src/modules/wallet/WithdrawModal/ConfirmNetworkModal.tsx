import type React from 'react';
import { Button } from 'modules/shared/Button';
import { type Network } from '../NetworkSelector';

interface Props {
  network: Network;
  onResolve?: (confirmed: boolean) => void;
}

const ConfirmNetworkModal: React.FC<Props> = ({ network, onResolve }) => {
  return (
    <div>
      <div className="mb-8 text-white/80">
        You have selected the{' '}
        <strong className="text-white">{network.name}</strong> network. Please
        confirm that your withdrawal address supports the{' '}
        <strong className="text-white">{network.description}</strong> network.
        If the receiving platform does not support it, your assets may be lost.
        If you are unsure, click the button below to verify it yourself.
      </div>

      <div className="flex justify-stretch">
        <Button
          className="basis-1/2"
          variant="alternative"
          onClick={() => onResolve?.(false)}
        >
          No, I’m not sure
        </Button>
        <div className="w-6" />
        <Button
          className="basis-1/2"
          variant="primary"
          onClick={() => onResolve?.(true)}
        >
          Yes, I’m sure
        </Button>
      </div>
    </div>
  );
};

export default ConfirmNetworkModal;
