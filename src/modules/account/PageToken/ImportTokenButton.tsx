import { clsx } from 'clsx';
import { Tooltip } from 'antd';
import Button from 'shared/Button';
import { WSDM_CONTRACT_ADDRESS } from 'modules/account/PageToken/web3/wsdm/contract';
import { TWSDM_CONTRACT_ADDRESS } from 'modules/account/PageToken/web3/twsdm/contract';
import { LOCKING_CONTRACT_ADDRESS } from 'modules/account/PageToken/web3/locking/contract';
import { ReactComponent as InfoIcon } from './icons/info.svg';
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
  {
    name: 'WSDM',
    symbol: 'WSDM',
    address: WSDM_CONTRACT_ADDRESS,
    description: 'Import the WSDM Token into your Wallet',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/30102.png',
  },
  {
    name: 'tWSDM',
    symbol: 'tWSDM',
    address: TWSDM_CONTRACT_ADDRESS,
    description: 'Import the tWSDM Token into your Wallet',
  },
  {
    name: 'lcWSDM',
    symbol: 'lcWSDM',
    address: LOCKING_CONTRACT_ADDRESS,
    description:
      'Import lockedWSDM (lcWSDM) Token into your Wallet. lcWSDM acts as your main tokens receipt during the locking period.',
  },
];

export default function ImportTokenButton({
  tokenSymbol,
  variant = 'primary-purple',
  className,
}: ImportTokenButtonProps) {
  const token = TOKENS.find(token => token.symbol === tokenSymbol);

  const importToken = async () => {
    await (window.ethereum as unknown as Ethereum)?.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: token?.address,
          symbol: tokenSymbol,
          decimals: 6,
          image: token?.image ?? undefined,
        },
      },
    });
  };

  return (
    <Button
      className={clsx(className, '!py-2')}
      variant={variant}
      onClick={importToken}
    >
      <div className="flex items-center gap-2">
        {token?.symbol === 'WSDM' ? (
          <img
            src="https://s2.coinmarketcap.com/static/img/coins/64x64/30102.png"
            className="h-8 w-8"
            alt="wsdm-token"
          />
        ) : (
          <WIcon className="h-6 w-6" />
        )}
        Import {token?.name}
        <Tooltip title={token?.description}>
          <InfoIcon className="mb-4" />
        </Tooltip>
      </div>
    </Button>
  );
}
