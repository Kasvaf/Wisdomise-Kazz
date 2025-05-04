import { clsx } from 'clsx';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useWatchAsset } from 'wagmi';
import {
  WSDM_CONTRACT_ADDRESS,
  TWSDM_CONTRACT_ADDRESS,
  LOCKING_CONTRACT_ADDRESS,
} from 'modules/account/PageToken/constants';
import { Button } from 'shared/v1-components/Button';
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
  className?: string;
  disabled?: boolean;
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
  className,
}: ImportTokenButtonProps) {
  const { t } = useTranslation('wisdomise-token');
  const { watchAsset } = useWatchAsset();
  const token = TOKENS.find(token => token.symbol === tokenSymbol);
  if (!token) {
    throw new Error('unexpected token symbol');
  }

  const importToken = async () => {
    watchAsset({
      type: 'ERC20',
      options: {
        address: token.address,
        symbol: tokenSymbol,
        decimals: 6,
      },
    });
  };

  return (
    <Button
      className={clsx(className, '!py-2')}
      variant="outline"
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
        {t('import')} {token?.name}
        <Tooltip title={token?.description}>
          <InfoIcon className="mb-4" />
        </Tooltip>
      </div>
    </Button>
  );
}
