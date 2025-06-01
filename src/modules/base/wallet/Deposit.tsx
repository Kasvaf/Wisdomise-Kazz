import { bxCopy, bxInfoCircle } from 'boxicons-quasar';
import { QRCodeSVG } from 'qrcode.react';
import { shortenAddress } from 'utils/shortenAddress';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { type Wallet } from 'api/wallets';
import { useShare } from 'shared/useShare';
import { useAccountNativeBalance } from 'api/chains';
import { ReactComponent as SolanaIcon } from './solana.svg';

export default function Deposit({ wallet }: { wallet: Wallet }) {
  const { data } = useAccountNativeBalance(wallet.address);
  const [copy, notif] = useShare('copy');

  return (
    <div className="text-xs">
      <p className="my-3 text-v1-content-secondary">
        Deposit SOL To Your {wallet.name} Wallet
      </p>
      <div className="justify-between rounded-xl bg-v1-surface-l4 p-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-sm text-v1-content-primary">{wallet.name}</h2>
            <div className="flex items-center gap-2 text-v1-content-secondary">
              {shortenAddress(wallet.address)}{' '}
              <button onClick={() => copy(wallet.address)}>
                <Icon name={bxCopy} size={12} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-4 rounded bg-black p-px">
              <SolanaIcon className="size-full" />
            </div>
            {data}
          </div>
        </div>
        <hr className="my-3 border-v1-inverse-overlay-10" />
        <div className="flex flex-col items-center">
          <div className="rounded-xl bg-white p-3">
            <QRCodeSVG value={`solana:${wallet.address}`} />
          </div>
          <p className="mt-4 text-v1-content-secondary">{wallet.address}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => copy(wallet.address)}
          >
            <Icon name={bxCopy} />
            Copy
          </Button>
        </div>
        <hr className="my-3 border-v1-inverse-overlay-10" />
        <div className="text-v1-content-notice">
          <Icon name={bxInfoCircle} className="mr-1 inline-block" size={12} />
          Caution: This address only supports SOL deposits via the Solana
          network. Please do not use other networks to avoid any loss of funds.
        </div>
      </div>
      {notif}
    </div>
  );
}
