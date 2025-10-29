import { useTraderAssetsQuery } from 'api';
import { useWalletAssets } from 'api/chains';
import { useActiveWallet, useConnectedWallet } from 'api/chains/wallet';
import type { Wallet } from 'api/wallets';
import { bxCopy } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useSolanaWalletPricedAssets } from 'modules/autoTrader/UserAssets/useSolanaWalletPricedAssets';
import { useActiveNetwork } from 'modules/base/active-network';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { BtnAppKitWalletConnect } from 'modules/base/wallet/BtnAppkitWalletConnect';
import { WalletSelector } from 'modules/base/wallet/BtnSolanaWallets';
import { ReactComponent as DepositIcon } from 'modules/base/wallet/deposit.svg';
import { useWalletActionHandler } from 'modules/base/wallet/useWalletActionHandler';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AccessShield } from 'shared/AccessShield';
import Badge from 'shared/Badge';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useShare } from 'shared/useShare';
import { Button } from 'shared/v1-components/Button';
import { Token, TokenLink } from 'shared/v1-components/Token';

interface AssetData {
  amount: number;
  network?: string;
  usd_equity?: number;
  address?: string;
}

const UserAsset: React.FC<{ asset: AssetData }> = ({ asset }) => {
  return (
    <TokenLink
      address={asset.address}
      className={clsx(
        '!text-v1-content-primary hover:!bg-v1-surface-l2 flex items-center justify-between px-3 mobile:py-3 py-2',
      )}
    >
      <Token
        address={asset.address}
        autoFill
        link={false}
        showAddress={false}
        subtitle={
          <ReadableNumber
            className="text-v1-content-secondary text-xxs"
            label="$"
            value={(asset.usd_equity ?? 0) / asset.amount}
          />
        }
        truncate
      />

      <div className="flex flex-col items-end gap-1">
        <ReadableNumber
          className="flex font-medium text-xs"
          value={asset.amount}
        />
        {asset.usd_equity !== 0 && (
          <ReadableNumber
            className="text-v1-content-secondary text-xxs"
            label="$"
            value={asset.usd_equity}
          />
        )}
      </div>
    </TokenLink>
  );
};

interface Props {
  className?: string;
  expanded?: boolean;
  containerClassName?: string;
}

const UserAssets: React.FC<
  Props & { title?: string; data?: AssetData[] | null; showTotal?: boolean }
> = ({ title, data, className, containerClassName, showTotal }) => {
  if (!data?.length) return null;
  const totalAssets = data?.reduce((a, b) => a + (b.usd_equity ?? 0), 0);
  return (
    <div className={className}>
      {(totalAssets > 0 || title) && showTotal && (
        <div className="id-title mb-3 mobile:mb-5 gap-2 text-sm">
          {title ? title + (totalAssets > 0 ? ': ' : '') : ' '}
          {totalAssets > 0 && <ReadableNumber label="$" value={totalAssets} />}
        </div>
      )}

      <div
        className={clsx(
          'flex flex-col overflow-hidden rounded-xl bg-v1-surface-l1',
          containerClassName,
        )}
      >
        {data?.map((asset, ind, arr) => (
          <React.Fragment key={asset.address}>
            <UserAsset asset={asset} />

            {ind !== arr.length - 1 && (
              <div className="mx-4 border-b border-b-white/5" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const UserTradingAssets = ({ className }: { className?: string }) => {
  const isLoggedIn = useIsLoggedIn();
  const { data: tradingAssets } = useTraderAssetsQuery();
  if (!isLoggedIn) return null;

  if (!tradingAssets?.length) return null;
  const totalAssets = tradingAssets?.reduce(
    (a, b) => a + (b.usd_equity ?? 0),
    0,
  );

  return (
    <div className={className}>
      <div className="id-title mb-3 mobile:mb-5 gap-2 text-sm">
        {`Trading Assets${totalAssets > 0 ? ': ' : ''}`}
        {totalAssets > 0 && <ReadableNumber label="$" value={totalAssets} />}
      </div>

      <UserAssets data={tradingAssets} />
    </div>
  );
};

const UserWallets = (props: Props) => {
  const net = useActiveNetwork();
  const { data: walletAssets } = useWalletAssets({});

  return net === 'the-open-network' ? (
    <UserAssets data={walletAssets} title="Wallet Assets" {...props} />
  ) : (
    <div>
      <p className="my-3 text-v1-content-secondary text-xs">Wallets</p>
      <WalletSelector
        className="-mr-2 -mt-3"
        expanded={props.expanded}
        radioClassName="w-full [&.ant-radio-wrapper]:!items-start [&_.ant-radio]:!mt-4 [&_.ant-radio]:!self-start"
        WalletOptionComponent={WalletItem}
      />
    </div>
  );
};

export default function UserPortfolio(props: Props) {
  return (
    <AccessShield mode="children" sizes={{ guest: true }}>
      <div className="p-3">
        <div className="flex flex-col gap-2">
          <UserTradingAssets />
          <UserWallets {...props} />
        </div>
      </div>
    </AccessShield>
  );
}

function WalletItem({ wallet }: { wallet?: Wallet; expanded?: boolean }) {
  const { address, connected } = useConnectedWallet();
  const { address: activeAddress } = useActiveWallet();
  const { data: walletAssets } = useWalletAssets({
    address: wallet?.address ?? address,
  });
  const navigate = useNavigate();
  const [copy, notif] = useShare('copy');

  const isActive = (wallet ? wallet.address : address) === activeAddress;

  return (
    <div className="w-full border-v1-inverse-overlay-10 border-b py-3">
      <div className="mb-2 flex items-center justify-between">
        <div
          className={clsx(
            'flex items-center gap-2 font-medium text-xs',
            isActive && 'bg-brand-gradient bg-clip-text text-transparent',
          )}
        >
          <div className="flex items-center gap-1">
            {wallet ? wallet.name : 'Connected Wallet'}
            {(wallet?.address || address) && (
              <HoverTooltip title="Copy Wallet Address">
                <button
                  className="mt-1 text-v1-content-secondary"
                  onClick={() => copy(wallet?.address ?? address ?? '')}
                >
                  <Icon name={bxCopy} size={16} />
                </button>
              </HoverTooltip>
            )}
          </div>

          {isActive && <Badge color="gradient" label="Active" />}
        </div>
        {wallet ? (
          <Button
            className="!bg-transparent !px-1"
            onClick={() => navigate(`/wallet/${wallet.key}`)}
            size="2xs"
            variant="outline"
          >
            Details
          </Button>
        ) : (
          <BtnAppKitWalletConnect
            network="solana"
            size="2xs"
            variant="outline"
          />
        )}
      </div>
      {wallet ? (
        <WalletAssets wallet={wallet} />
      ) : (
        connected && <UserAssets data={walletAssets} />
      )}
      {notif}
    </div>
  );
}

function WalletAssets({ wallet }: { wallet: Wallet }) {
  const isLoggedIn = useIsLoggedIn();
  const { data: walletAssets } = useSolanaWalletPricedAssets(wallet.address);
  const { withdrawDepositModal, deposit } = useWalletActionHandler();

  if (!isLoggedIn) return null;

  return walletAssets?.length ? (
    <UserAssets data={walletAssets} />
  ) : (
    <div className="flex h-44 flex-col items-center justify-center rounded-xl bg-v1-surface-l1">
      <DepositIcon className="size-8" />
      <p className="my-2 text-xxs">Deposit and start your trade journey</p>
      <Button onClick={() => deposit(wallet.address)} size="xs">
        Deposit
      </Button>
      {withdrawDepositModal}
    </div>
  );
}
