import { Radio } from 'antd';
import { useUserWalletAssets } from 'api/chains';
import {
  useActiveWallet,
  useConnectedWallet,
  useCustodialWallet,
} from 'api/chains/wallet';
import { useSymbolsInfo } from 'api/symbol';
import { useWalletsQuery, type Wallet } from 'api/wallets';
import { bxCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { AccountBalance } from 'modules/autoTrader/PageTrade/AdvancedSignalForm/AccountBalance';
import { useSolanaWalletBalanceInUSD } from 'modules/autoTrader/UserAssets/useSolanaUserAssets';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { BtnAppKitWalletConnect } from 'modules/base/wallet/BtnAppkitWalletConnect';
import CreateWalletBtn from 'modules/base/wallet/CreateWalletBtn';
import TotalBalance from 'modules/base/wallet/TotalBalance';
import { useWalletActionHandler } from 'modules/base/wallet/useWalletActionHandler';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { type FC, type ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from 'shared/Badge';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { Coins } from 'shared/Coins';
import Icon from 'shared/Icon';
import { useShare } from 'shared/useShare';
import { Button, type ButtonSize } from 'shared/v1-components/Button';
import { roundSensible } from 'utils/numbers';
import { shortenAddress } from 'utils/shortenAddress';
import useIsMobile from 'utils/useIsMobile';
import type { Surface } from 'utils/useSurface';
import { isMiniApp } from 'utils/version';
import { ReactComponent as WalletIcon } from './wallet-icon.svg';

export default function BtnSolanaWallets({
  className,
  showAddress,
  showBalance,
  size,
  variant = 'ghost',
  surface = 1,
}: {
  className?: string;
  showAddress?: boolean;
  showBalance?: boolean;
  size?: ButtonSize;
  variant?: 'outline' | 'ghost';
  surface?: Surface;
}) {
  const isMobile = useIsMobile();
  const isLoggedIn = useIsLoggedIn();
  const { icon, connected } = useConnectedWallet();
  const { address, isCustodial } = useActiveWallet();

  if (!isLoggedIn) return null;

  return (
    <ClickableTooltip chevron={showAddress ?? false} title={<UserWallets />}>
      <Button
        className={className}
        size={isMobile ? 'md' : (size ?? 'xs')}
        surface={surface}
        variant={variant}
      >
        {!isMobile && connected && !isCustodial && icon ? (
          <img alt="" className="size-5" src={icon} />
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
      <TotalBalance className="-mx-3 -mt-3 mobile:!bg-transparent mb-2" />
      <div className="text-v1-inverse-overlay-70 text-xxs">Wallets</div>
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
        onChange={event => {
          setCw(event.target.value || null);
        }}
        options={options}
        value={cw?.key ?? false}
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
    <div className="-mr-2 flex items-center justify-between gap-4 border-v1-inverse-overlay-10 border-b py-2 text-xs">
      <div>
        <div
          className={clsx(
            'flex items-center gap-2 font-medium',
            isActive && 'bg-brand-gradient bg-clip-text text-transparent',
          )}
        >
          {wallet ? wallet.name : 'Connected Wallet'}
          {isActive && (
            <Badge className="!h-3" color="gradient" label="Active" />
          )}
        </div>
        <div className="flex items-center gap-1 text-v1-inverse-overlay-50 text-xxs">
          {wallet ? (
            <>
              {shortenAddress(wallet.address)}
              <button onClick={() => copy(wallet.address)}>
                <Icon name={bxCopy} size={12} />
              </button>
            </>
          ) : connected ? (
            <div className="flex items-center gap-1">
              <img className="size-3" src={icon} /> {name}
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
            className="!bg-transparent"
            onClick={() =>
              navigate(
                getUrl({ slug: wallet.key, detail: 'wallet', view: 'detail' }),
              )
            }
            size="xs"
            variant="outline"
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

function UserMiniAssets({ wallet }: { wallet?: Wallet }) {
  const { address } = useConnectedWallet();
  const { data: walletAssets } = useUserWalletAssets(
    isMiniApp ? 'the-open-network' : 'solana',
    wallet?.address ?? address,
  );
  const { data: symbols } = useSymbolsInfo(walletAssets?.map(a => a.slug));

  return symbols && (wallet?.address || address) ? (
    <div className="flex items-center justify-center rounded-md border border-v1-inverse-overlay-10 px-2">
      <Coins coins={symbols} />
    </div>
  ) : null;
}
