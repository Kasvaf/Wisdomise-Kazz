import { useMemo } from 'react';
import Button from 'shared/Button';
import { WSDM_CONTRACT_ADDRESS } from 'modules/account/PageToken/web3/wsdm/contract';
import { TWSDM_CONTRACT_ADDRESS } from 'modules/account/PageToken/web3/twsdm/contract';
import { LOCKING_CONTRACT_ADDRESS } from 'modules/account/PageToken/web3/locking/contract';
import { ReactComponent as WIcon } from './icons/w.svg';

export interface Ethereum {
  request: (args: {
    method: string;
    params?: {
      type: string;
      options: Record<string, unknown>;
    };
  }) => Promise<void>;
}

interface ImportTokenButtonProps {
  tokenSymbol: 'WSDM' | 'tWSDM' | 'lcWSDM';
  variant: 'primary-purple' | 'secondary' | 'alternative';
  className?: string;
}

const TOKENS = [
  { name: 'WSDM', symbol: 'WSDM', address: WSDM_CONTRACT_ADDRESS },
  { name: 'tWSDM', symbol: 'tWSDM', address: TWSDM_CONTRACT_ADDRESS },
  { name: 'lcWSDM', symbol: 'lcWSDM', address: LOCKING_CONTRACT_ADDRESS },
];

export default function ImportTokenButton({
  tokenSymbol,
  variant = 'primary-purple',
  className,
}: ImportTokenButtonProps) {
  const token = useMemo(
    () => TOKENS.find(token => token.symbol === tokenSymbol),
    [tokenSymbol],
  );

  const importToken = async () => {
    await (window.ethereum as unknown as Ethereum)?.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: token?.address,
          symbol: tokenSymbol,
          decimals: 6,
          // image:
          //   'https://cash-content.s3.eu-west-3.amazonaws.com/content/WSDM-Token-01.png',
        },
      },
    });
  };

  return (
    <Button className={className} variant={variant} onClick={importToken}>
      <div className="flex items-center gap-2">
        <WIcon />
        Import {token?.name}
      </div>
    </Button>
  );
}
