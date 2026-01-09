import { Slider } from 'antd';
import { bxCog, bxCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { AccountBalance } from 'modules/autoTrader/PageTrade/AdvancedSignalForm/AccountBalance';
import { SolanaIcon } from 'modules/autoTrader/TokenActivity';
import { useSolanaWalletBalanceInUSD } from 'modules/autoTrader/UserAssets/useSolanaWalletPricedAssets';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useUserSettings } from 'modules/base/auth/UserSettingsProvider';
import { BtnAppKitWalletConnect } from 'modules/base/wallet/BtnAppkitWalletConnect';
import BtnCreateWallet from 'modules/base/wallet/CreateWalletBtn';
import TotalBalance from 'modules/base/wallet/TotalBalance';
import { useWalletActionHandler } from 'modules/base/wallet/useWalletActionHandler';
import { type FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTokenBalance, useWalletAssets } from 'services/chains';
import {
  WRAPPED_SOLANA_CONTRACT_ADDRESS,
  WRAPPED_SOLANA_SLUG,
} from 'services/chains/constants';
import {
  type UserWallet,
  useConnectedWallet,
  useWallets,
} from 'services/chains/wallet';
import { ClickableTooltip } from 'shared/ClickableTooltip';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Tokens } from 'shared/Tokens';
import { useShare } from 'shared/useShare';
import { Badge } from 'shared/v1-components/Badge';
import { Button, type ButtonSize } from 'shared/v1-components/Button';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Checkbox } from 'shared/v1-components/Checkbox';
import { Dialog } from 'shared/v1-components/Dialog';
import { Input } from 'shared/v1-components/Input';
import { useSessionStorage } from 'usehooks-ts';
import { shortenAddress } from 'utils/address';
import type { Surface } from 'utils/useSurface';
import { ReactComponent as PrimaryWallet } from './primary-wallet.svg';
import { ReactComponent as WalletIcon } from './wallet-icon.svg';

export const WalletSolanaBalance = ({
  walletAddress,
}: {
  walletAddress?: string;
}) => {
  const { data } = useTokenBalance({
    network: 'solana',
    walletAddress,
    tokenAddress: WRAPPED_SOLANA_CONTRACT_ADDRESS,
  });

  return (
    <HoverTooltip title="Balance">
      <Badge className="gap-1" color="neutral" size="md" variant="outline">
        <SolanaIcon />
        <ReadableNumber value={data} />
      </Badge>
    </HoverTooltip>
  );
};

export const PrimaryWalletIcon = () => {
  return (
    <HoverTooltip
      title={
        <div className="w-40">
          <p className="mb-1">Primary Wallet</p>
          <p className="text-v1-content-secondary text-xs">
            This wallet will be used to receive rewards and for the auto trader.
          </p>
        </div>
      }
    >
      <PrimaryWallet />
    </HoverTooltip>
  );
};

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
  const isLoggedIn = useIsLoggedIn();
  const { selectedWallets } = useWallets();

  if (!isLoggedIn) return null;

  return (
    <ClickableTooltip chevron={showAddress ?? false} title={<UserWallets />}>
      <Button
        className={className}
        size={size ?? 'xs'}
        surface={surface}
        variant={variant}
      >
        <WalletIcon />
        <span className="ml-1">{selectedWallets.length}</span>
        {showBalance && <AccountBalance slug={WRAPPED_SOLANA_SLUG} />}
      </Button>
    </ClickableTooltip>
  );
}

function UserWallets() {
  return (
    <div className="w-[25rem]">
      <TotalBalance className="-mx-3 -mt-3 max-md:!bg-transparent mb-2" />
      <WalletSelector WalletOptionComponent={WalletItem} />
    </div>
  );
}

export function WalletSelector({
  WalletOptionComponent,
  className,
}: {
  WalletOptionComponent: FC<{ wallet: UserWallet }>;
  className?: string;
}) {
  const {
    toggleWallet,
    custodialWallets,
    isCustodial,
    setIsCustodial,
    connectedWallet,
    selectAll,
    enableSelectAll,
    deselectAll,
  } = useWallets();

  return (
    <div className={className}>
      <ButtonSelect
        className="mb-3"
        onChange={newValue => setIsCustodial(newValue)}
        options={[
          { label: 'Custodial', value: true },
          { label: 'Non-custodial', value: false },
        ]}
        size="xs"
        value={isCustodial}
      />
      {isCustodial ? (
        <div>
          <div className="flex items-center justify-between">
            <Button
              onClick={() => (enableSelectAll ? selectAll() : deselectAll())}
              size="2xs"
              surface={2}
              variant="ghost"
            >
              {enableSelectAll ? 'Select All' : 'Deselect All'}
            </Button>
            <MultiWalletBuySettings />
          </div>
          <hr className="my-2 border-white/10" />
          {custodialWallets.map(wallet => (
            <div
              className="flex items-center gap-3"
              key={wallet.network + wallet.address}
            >
              <Checkbox
                onChange={() => {
                  toggleWallet({
                    address: wallet.address!,
                    network: wallet.network,
                  });
                }}
                value={wallet.isSelected}
              />
              <WalletOptionComponent wallet={wallet} />
            </div>
          ))}
          <BtnCreateWallet />
        </div>
      ) : (
        <WalletOptionComponent wallet={connectedWallet} />
      )}
    </div>
  );
}

function WalletItem({ wallet }: { wallet: UserWallet }) {
  const { connected, address, name, icon } = useConnectedWallet();
  const { withdrawDepositModal } = useWalletActionHandler();
  const [copy, notif] = useShare('copy');
  const navigate = useNavigate();
  const { balance } = useSolanaWalletBalanceInUSD(
    wallet ? wallet?.address : address,
  );
  const [, setSlug] = useSessionStorage('walletSlug', '');

  return (
    <div className="flex w-full items-center justify-between gap-4 py-2 text-xs">
      <div className="flex flex-col gap-1">
        <div
          className={clsx(
            'flex items-center gap-2 font-medium',
            wallet.isSelected && 'text-v1-content-brand',
          )}
        >
          {wallet.name}
          {wallet.isPrimary && <PrimaryWalletIcon />}
          {wallet.icon && (
            <img alt="wallet" className="size-3" src={wallet.icon} />
          )}
        </div>
        <div className="flex items-center gap-1 text-2xs text-v1-inverse-overlay-50">
          {wallet.address ? (
            <>
              {shortenAddress(wallet.address)}
              <button onClick={() => wallet.address && copy(wallet.address)}>
                <Icon name={bxCopy} size={12} />
              </button>
            </>
          ) : connected ? (
            <div className="flex items-center gap-1">
              <img alt="" className="size-3" src={icon} /> {name}
            </div>
          ) : (
            'Not Connected'
          )}
          {(wallet || address) && (
            <ReadableNumber
              className="ml-2"
              format={{ decimalLength: 2 }}
              label="$"
              value={balance}
            />
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <WalletAssets walletAddress={wallet?.address} />
        <WalletSolanaBalance walletAddress={wallet.address} />
        {wallet.isCustodial ? (
          <Button
            className="!bg-transparent"
            onClick={() => {
              if (wallet.key) {
                setSlug(wallet.key);
                navigate('/portfolio');
              }
            }}
            size="xs"
            variant="outline"
          >
            History
          </Button>
        ) : (
          <BtnAppKitWalletConnect network="solana" variant="outline" />
        )}
      </div>
      {withdrawDepositModal}
      {notif}
    </div>
  );
}

export function WalletAssets({ walletAddress }: { walletAddress?: string }) {
  const { address: connectedWallet } = useConnectedWallet();
  const { data: assets } = useWalletAssets({
    address: walletAddress ?? connectedWallet,
  });
  const addresses = useMemo(
    () =>
      assets
        ?.map(token => token.address)
        .filter(addr => addr !== WRAPPED_SOLANA_CONTRACT_ADDRESS),
    [assets],
  );

  return addresses?.length && (walletAddress || connectedWallet) ? (
    <Badge color="neutral" size="md" variant="outline">
      <Tokens addresses={addresses} />
    </Badge>
  ) : null;
}

function MultiWalletBuySettings() {
  const [open, setOpen] = useState(false);
  const { settings, updateMultiWalletSettings } = useUserSettings();
  const [variance, setVariance] = useState(
    settings.multi_wallet.variance * 100,
  );
  const [delay, setDelay] = useState(settings.multi_wallet.delay);

  const save = () => {
    updateMultiWalletSettings({ variance: variance / 100, delay });
  };

  return (
    <>
      <HoverTooltip title="Multi Wallet Buy Settings">
        <Button
          fab
          onClick={() => setOpen(true)}
          size="2xs"
          surface={2}
          variant="ghost"
        >
          <Icon className="[&>svg]:size-4" name={bxCog} />
        </Button>
      </HoverTooltip>

      <Dialog
        className="md:max-w-[25rem]"
        onClose={() => setOpen(false)}
        open={open}
      >
        <div className="p-4">
          <h1 className="mb-10 text-lg">Multi Wallet Buy Settings</h1>
          <div className="mb-2 flex items-center justify-between">
            <h2>Buy Variance</h2>
            <Input
              className="w-20"
              max={100}
              min={0}
              onChange={value => setVariance(value ?? 0)}
              size="xs"
              suffixIcon="%"
              type="number"
              value={variance}
            />
          </div>
          <p className="text-v1-content-primary/70 text-xs">
            The variance of the buy amount across the selected wallets. 0% to
            100% randomly.
          </p>
          <div className="mx-3">
            <Slider
              marks={{ 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }}
              max={100}
              min={0}
              onChange={value => setVariance(value)}
              step={1}
              value={variance}
            />
          </div>
          <div className="mt-16 mb-3 flex items-center justify-between">
            <h1>Transaction Delay</h1>
            <Input
              className="w-20"
              max={1000}
              min={0}
              onChange={value => setDelay(value ?? 0)}
              size="xs"
              suffixIcon="ms"
              type="number"
              value={delay}
            />
          </div>
          <p className="text-v1-content-primary/70 text-xs">
            The delay between each transaction in milliseconds. 0ms means no
            delay.
          </p>
          <div className="mx-3">
            <Slider
              marks={{
                0: '0ms',
                250: '250ms',
                500: '500ms',
                750: '750ms',
                1000: '1s',
              }}
              max={1000}
              min={0}
              onChange={value => setDelay(value)}
              step={1}
              value={delay}
            />
          </div>
          <Button
            className="mt-5 w-full"
            onClick={() => {
              save();
              setOpen(false);
            }}
            size="sm"
          >
            Done
          </Button>
        </div>
      </Dialog>
    </>
  );
}
