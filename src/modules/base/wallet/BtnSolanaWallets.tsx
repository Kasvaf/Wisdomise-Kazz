import { Radio } from 'antd';
import { bxCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type FC, type ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, type ButtonSize } from 'shared/v1-components/Button';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { useUserWalletAssets } from 'api/chains';
import { shortenAddress } from 'utils/shortenAddress';
import Icon from 'shared/Icon';
import { isMiniApp } from 'utils/version';
import { useSymbolInfo } from 'api/symbol';
import { useWalletActionHandler } from 'modules/base/wallet/useWalletActionHandler';
import { useWalletsQuery, type Wallet } from 'api/wallets';
import Badge from 'shared/Badge';
import useIsMobile from 'utils/useIsMobile';
import { useShare } from 'shared/useShare';
import { BtnAppKitWalletConnect } from 'modules/base/wallet/BtnAppkitWalletConnect';
import {
  useConnectedWallet,
  useActiveWallet,
  useCustodialWallet,
} from 'api/chains/wallet';
import CreateWalletBtn from 'modules/base/wallet/CreateWalletBtn';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { roundSensible } from 'utils/numbers';
import { useSolanaWalletBalanceInUSD } from 'modules/autoTrader/UserAssets/useSolanaUserAssets';
import TotalBalance from 'modules/base/wallet/TotalBalance';
import { AccountBalance } from 'modules/autoTrader/PageTrade/AdvancedSignalForm/AccountBalance';
// eslint-disable-next-line import/max-dependencies
import { ReactComponent as WalletIcon } from './wallet-icon.svg';

export default function BtnSolanaWallets({
  className,
  showAddress,
  showBalance,
  size,
  variant = 'ghost',
}: {
  className?: string;
  showAddress?: boolean;
  showBalance?: boolean;
  size?: ButtonSize;
  variant?: 'outline' | 'ghost';
}) {
  const isMobile = useIsMobile();
  const isLoggedIn = useIsLoggedIn();
  const { icon, connected } = useConnectedWallet();
  const { address, isCustodial } = useActiveWallet();

  if (!isLoggedIn) return null;

  return (
    <ClickableTooltip chevron={showAddress ?? false} title={<UserWallets />}>
      <Button
        variant={variant}
        size={isMobile ? 'md' : size ?? 'xs'}
        className={className}
      >
        {!isMobile && connected && !isCustodial && icon ? (
          <img className="size-5" src={icon} alt="" />
        ) : (
          <WalletIcon />
        )}
        {showAddress && (address ? shortenAddress(address) : 'Not Connected')}
        {showBalance && <AccountBalance slug="wrapped-solana" />}
      </Button>
    </ClickableTooltip>
  );
}

function UserWallets() {
  return (
    <div>
      <TotalBalance className="-mx-3 -mt-3 mb-2 mobile:!bg-transparent" />
      <div className="text-xxs text-v1-inverse-overlay-70">Wallets</div>
      <WalletSelector WalletOptionComponent={WalletItem} />
    </div>
  );
}

export function WalletSelector({
  WalletOptionComponent,
  className,
  radioClassName,
  expanded,
}: {
  WalletOptionComponent: FC<{ wallet?: Wallet; expanded?: boolean }>;
  className?: string;
  radioClassName?: string;
  expanded?: boolean;
}) {
  const { cw, setCw } = useCustodialWallet();
  const { data: wallets } = useWalletsQuery();
  const isMobile = useIsMobile();

  const options = useMemo(() => {
    const ops: Array<{ value: string | boolean; label: ReactNode }> =
      wallets?.results?.map(w => ({
        value: w.key,
        label: <WalletOptionComponent wallet={w} />,
      })) ?? [];
    if (!isMobile) {
      ops.unshift({
        value: false,
        label: <WalletOptionComponent expanded={expanded} />,
      });
    }
    return ops;
  }, [WalletOptionComponent, isMobile, wallets?.results, expanded]);

  return (
    <div className={className}>
      <Radio.Group
        className={clsx(
          radioClassName,
          'w-full [&_.ant-radio-wrapper>span:last-child]:w-full [&_.ant-radio-wrapper]:w-full',
        )}
        value={cw?.key ?? false}
        onChange={event => {
          setCw(event.target.value || null);
        }}
        options={options}
      />
      <CreateWalletBtn />
    </div>
  );
}

function WalletItem({ wallet }: { wallet?: Wallet }) {
  const { connected, address, name, icon } = useConnectedWallet();
  const { address: activeAddress } = useActiveWallet();
  const { withdrawDepositModal } = useWalletActionHandler();
  const [copy, notif] = useShare('copy');
  const { getUrl } = useDiscoveryRouteMeta();
  const navigate = useNavigate();
  const { balance } = useSolanaWalletBalanceInUSD(
    wallet ? wallet?.address : address,
  );

  const isActive = (wallet ? wallet.address : address) === activeAddress;

  return (
    <div className="-mr-2 flex items-center justify-between gap-4 border-b border-v1-inverse-overlay-10 py-2 text-xs">
      <div>
        <div
          className={clsx(
            'flex items-center gap-2 font-medium',
            isActive && 'bg-pro-gradient bg-clip-text text-transparent',
          )}
        >
          {wallet ? wallet.name : 'Connected Wallet'}
          {isActive && <Badge color="pro" label="Active" className="!h-3" />}
        </div>
        <div className="flex items-center gap-1 text-xxs text-v1-inverse-overlay-50">
          {wallet ? (
            <>
              {shortenAddress(wallet.address)}
              <button onClick={() => copy(wallet.address)}>
                <Icon name={bxCopy} size={12} />
              </button>
            </>
          ) : connected ? (
            <div className="flex items-center gap-1">
              <img src={icon} className="size-3" /> {name}
            </div>
          ) : (
            'Not Connected'
          )}
          {(wallet || address) && (
            <span className="ml-2">${roundSensible(balance)}</span>
          )}
        </div>
      </div>
      <div className="flex gap-1">
        <UserMiniAssets wallet={wallet} />
        {wallet ? (
          <Button
            onClick={() =>
              navigate(
                getUrl({ slug: wallet.key, detail: 'wallet', view: 'both' }),
              )
            }
            variant="outline"
            size="xs"
            className="!bg-transparent"
          >
            Details
          </Button>
        ) : (
          <BtnAppKitWalletConnect network="solana" />
        )}
      </div>
      {withdrawDepositModal}
      {notif}
    </div>
  );
}

const MAX_ASSETS = 3;
function UserMiniAssets({ wallet }: { wallet?: Wallet }) {
  const { address } = useConnectedWallet();
  const { data: walletAssets } = useUserWalletAssets(
    isMiniApp ? 'the-open-network' : 'solana',
    wallet?.address ?? address,
  );

  return walletAssets?.length && (wallet?.address || address) ? (
    <div className="flex items-center justify-center rounded-md border border-v1-inverse-overlay-10 pl-5 pr-3">
      {walletAssets
        ?.filter((_, index) => index < MAX_ASSETS)
        .map(walletAsset => (
          <div key={walletAsset.slug} className="-ml-2">
            <AssetIcon slug={walletAsset.slug} />
          </div>
        ))}

      {walletAssets.length > MAX_ASSETS && (
        <span className="ml-2 text-xxs">{walletAssets.length}</span>
      )}
    </div>
  ) : null;
}

function AssetIcon({ slug }: { slug: string }) {
  const { data: baseInfo } = useSymbolInfo(slug);

  return baseInfo?.logo_url ? (
    <img
      src={baseInfo?.logo_url}
      alt=""
      className="size-5 rounded-full bg-v1-surface-l3"
    />
  ) : null;
}
