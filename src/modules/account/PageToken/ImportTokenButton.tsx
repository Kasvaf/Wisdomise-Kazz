import Button from 'shared/Button';
import { WSDM_CONTRACT_ADDRESS } from 'modules/account/PageToken/web3/wsdm/wsdmContract';
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

export default function ImportTokenButton() {
  const importToken = async () => {
    await (window.ethereum as unknown as Ethereum)?.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: WSDM_CONTRACT_ADDRESS,
          symbol: 'WSDM',
          decimals: 6,
          // image:
          //   'https://cash-content.s3.eu-west-3.amazonaws.com/content/WSDM-Token-01.png',
        },
      },
    });
  };

  return (
    <Button
      variant="alternative"
      className="bg-gradient-to-bl from-[rgba(97,82,152,0.40)] from-15% to-[rgba(66,66,123,0.40)] to-75% brightness-125"
      onClick={importToken}
    >
      <div className="flex items-center gap-2">
        <WIcon />
        Import WSDM
      </div>
    </Button>
  );
}
