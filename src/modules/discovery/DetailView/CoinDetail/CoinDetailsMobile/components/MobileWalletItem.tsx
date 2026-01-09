import { bxCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { SolanaIcon } from 'modules/autoTrader/TokenActivity';
import { useSolanaWalletBalanceInUSD } from 'modules/autoTrader/UserAssets/useSolanaWalletPricedAssets';
import { BtnAppKitWalletConnect } from 'modules/base/wallet/BtnAppkitWalletConnect';
import {
  PrimaryWalletIcon,
  WalletAssets,
} from 'modules/base/wallet/BtnSolanaWallets';
import { useWalletActionHandler } from 'modules/base/wallet/useWalletActionHandler';
import { useNavigate } from 'react-router-dom';
import { useTokenBalance } from 'services/chains';
import { WRAPPED_SOLANA_CONTRACT_ADDRESS } from 'services/chains/constants';
import { type UserWallet, useConnectedWallet } from 'services/chains/wallet';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useShare } from 'shared/useShare';
import { Badge } from 'shared/v1-components/Badge';
import { Button } from 'shared/v1-components/Button';
import { useSessionStorage } from 'usehooks-ts';
import { shortenAddress } from 'utils/address';

export function MobileWalletItem({ wallet }: { wallet: UserWallet }) {
  const { connected, address, name, icon } = useConnectedWallet();
  const { withdrawDepositModal } = useWalletActionHandler();
  const [copy, notif] = useShare('copy');
  const navigate = useNavigate();
  const { balance } = useSolanaWalletBalanceInUSD(
    wallet ? wallet?.address : address,
  );
  const [, setSlug] = useSessionStorage('walletSlug', '');

  const { data: solBalance } = useTokenBalance({
    network: 'solana',
    walletAddress: wallet?.address,
    tokenAddress: WRAPPED_SOLANA_CONTRACT_ADDRESS,
  });

  return (
    <div className="flex w-full flex-col gap-3 py-3 text-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div
            className={clsx(
              'flex items-center gap-2 font-medium',
              wallet.isSelected && 'text-v1-content-brand',
            )}
          >
            {wallet.name}
            {wallet.isPrimary && <PrimaryWalletIcon />}
            {wallet.icon && (
              <img alt="wallet" className="size-4" src={wallet.icon} />
            )}
          </div>
          <div className="flex items-center gap-2 text-v1-inverse-overlay-50 text-xs">
            {wallet.address ? (
              <>
                {shortenAddress(wallet.address)}
                <button onClick={() => wallet.address && copy(wallet.address)}>
                  <Icon name={bxCopy} size={14} />
                </button>
              </>
            ) : connected ? (
              <div className="flex items-center gap-1">
                <img alt="" className="size-4" src={icon} /> {name}
              </div>
            ) : (
              'Not Connected'
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <ReadableNumber
              format={{ decimalLength: 2 }}
              label="$"
              value={balance}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <HoverTooltip title="SOL Balance">
            <Badge
              className="gap-1"
              color="neutral"
              size="sm"
              variant="outline"
            >
              <SolanaIcon />
              <ReadableNumber value={solBalance} />
            </Badge>
          </HoverTooltip>
          <WalletAssets walletAddress={wallet?.address} />
        </div>
      </div>
      {wallet.isCustodial ? (
        <Button
          block
          onClick={() => {
            if (wallet.key) {
              setSlug(wallet.key);
              navigate('/portfolio');
            }
          }}
          size="sm"
          variant="outline"
        >
          History
        </Button>
      ) : (
        <BtnAppKitWalletConnect network="solana" variant="outline" />
      )}
      {withdrawDepositModal}
      {notif}
    </div>
  );
}
