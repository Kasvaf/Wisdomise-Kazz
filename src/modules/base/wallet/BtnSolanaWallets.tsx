import { Radio } from 'antd';
import { bxCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { type ReactNode, useMemo } from 'react';
import { Button } from 'shared/v1-components/Button';
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
  useActiveClientWallet,
  useActiveWallet,
  useCustodialWallet,
} from 'api/chains/wallet';
import CreateWalletBtn from 'modules/base/wallet/CreateWalletBtn';
import { useHasFlag } from 'api';
// eslint-disable-next-line import/max-dependencies
import { ReactComponent as WalletIcon } from './wallet-icon.svg';

export default function BtnSolanaWallets() {
  const isMobile = useIsMobile();
  const isLoggedIn = useIsLoggedIn();
  const { data: wallets } = useWalletsQuery();
  const { icon, connected } = useActiveClientWallet();
  const hasFlag = useHasFlag();

  if (!isLoggedIn) return null;

  return (
    <ClickableTooltip chevron={false} title={<BtnWalletsContent />}>
      <Button variant="outline" size={isMobile ? 'md' : 'xs'} className="gap-2">
        <WalletIcon />
        {!isMobile && (
          <>
            {hasFlag('/wallets') && wallets?.count}
            {/* <div className="size-4 rounded bg-black p-px"> */}
            {/*   <SolanaIcon className="!size-full" /> */}
            {/* </div> */}
            {connected && (
              <>
                {hasFlag('/wallets') && <span>+</span>}
                <img className="size-4" src={icon} alt="" />
              </>
            )}
          </>
        )}
      </Button>
    </ClickableTooltip>
  );
}

function BtnWalletsContent() {
  const { cw, setCw } = useCustodialWallet();
  const { data: wallets } = useWalletsQuery();
  const isMobile = useIsMobile();

  const options = useMemo(() => {
    const ops: Array<{ value: string | boolean; label: ReactNode }> =
      wallets?.results?.map(w => ({
        value: w.key,
        label: <WalletItem wallet={w} />,
      })) ?? [];
    if (!isMobile) {
      ops.unshift({ value: false, label: <WalletItem /> });
    }
    return ops;
  }, [isMobile, wallets]);

  return (
    <div>
      <div className="text-xxs text-v1-inverse-overlay-70">Wallets</div>
      <Radio.Group
        className="w-full [&_.ant-radio-wrapper>span:last-child]:w-full [&_.ant-radio-wrapper]:w-full"
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
  const { connected, address, name, icon } = useActiveClientWallet();
  const { address: activeAddress } = useActiveWallet();
  const { withdrawDepositModal, deposit, withdraw } = useWalletActionHandler();
  const [copy, notif] = useShare('copy');

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
        </div>
      </div>
      <div>
        {wallet ? (
          <div className="flex gap-1">
            <Button
              className="!bg-transparent"
              variant="outline"
              size="xs"
              onClick={() => deposit(wallet.address)}
            >
              Deposit
            </Button>
            <Button
              className="!bg-transparent"
              variant="outline"
              size="xs"
              onClick={() => withdraw(wallet.address)}
            >
              Withdraw
            </Button>
          </div>
        ) : (
          <div className="flex items-stretch gap-1">
            {connected && <UserAssets />}
            <BtnAppKitWalletConnect network="solana" />
          </div>
        )}
      </div>
      {withdrawDepositModal}
      {notif}
    </div>
  );
}

function UserAssets() {
  const { address } = useActiveClientWallet();
  const { data: walletAssets } = useUserWalletAssets(
    isMiniApp ? 'the-open-network' : 'solana',
    address,
  );

  return walletAssets?.length ? (
    <div className="flex items-center justify-center rounded-md border border-v1-inverse-overlay-10 pl-5 pr-3">
      {walletAssets?.map(walletAsset => (
        <div key={walletAsset.slug} className="-ml-2">
          <AssetIcon slug={walletAsset.slug} />
        </div>
      ))}
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
