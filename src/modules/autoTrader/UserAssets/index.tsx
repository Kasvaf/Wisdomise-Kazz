/* eslint-disable import/max-dependencies */
import { clsx } from 'clsx';
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { bxCopy } from 'boxicons-quasar';
import { useUserAssets } from 'api';
import { useSymbolInfo } from 'api/symbol';
import { useUserWalletAssets } from 'api/chains';
import { isMiniApp } from 'utils/version';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import Spin from 'shared/Spin';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { useActiveNetwork } from 'modules/base/active-network';
import { type Wallet } from 'api/wallets';
import { useWalletActionHandler } from 'modules/base/wallet/useWalletActionHandler';
import Badge from 'shared/Badge';
import { HoverTooltip } from 'shared/HoverTooltip';
import { BtnAppKitWalletConnect } from 'modules/base/wallet/BtnAppkitWalletConnect';
import { ReactComponent as DepositIcon } from 'modules/base/wallet/deposit.svg';
import { useConnectedWallet, useActiveWallet } from 'api/chains/wallet';
import { useShare } from 'shared/useShare';
import { WalletSelector } from 'modules/base/wallet/BtnSolanaWallets';
import { Coin } from 'shared/v1-components/Coin';
import { useSolanaUserAssets } from 'modules/autoTrader/UserAssets/useSolanaUserAssets';

interface AssetData {
  slug: string;
  amount: number;
  network?: string;
  usd_equity?: number;
}

const UserAsset: React.FC<{ asset: AssetData }> = ({ asset }) => {
  const { getUrl, params } = useDiscoveryRouteMeta();
  const { data: baseInfo, isLoading: baseLoading } = useSymbolInfo(asset.slug);

  return (
    <NavLink
      className={clsx(
        '!text-v1-content-primary hover:!bg-v1-surface-l2 flex items-center justify-between px-4 py-2 mobile:py-3',
        params.slug === asset.slug && '!bg-v1-surface-l2',
      )}
      to={getUrl({
        detail: 'coin',
        slug: asset.slug,
        view: 'both',
      })}
    >
      {baseInfo ? (
        <Coin
          abbreviation={baseInfo.abbreviation}
          name={baseInfo.name}
          logo={baseInfo.logo_url}
          // networks={baseInfo.networks}
          href={false}
          truncate
          extra={
            <ReadableNumber
              className="text-v1-content-secondary"
              value={(asset.usd_equity ?? 0) / asset.amount}
              label="$"
            />
          }
        />
      ) : baseLoading ? (
        <Spin />
      ) : (
        <div />
      )}
      <div className="flex flex-col items-end">
        <ReadableNumber
          className="flex text-xs font-medium"
          value={asset.amount}
        />
        {asset.usd_equity !== 0 && (
          <ReadableNumber
            className="text-xxs text-v1-content-secondary"
            value={asset.usd_equity}
            label="$"
          />
        )}
      </div>
    </NavLink>
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
        <div className="id-title mb-3 gap-2 text-sm mobile:mb-5">
          {title ? title + (totalAssets > 0 ? ': ' : '') : ' '}
          {totalAssets > 0 && <ReadableNumber value={totalAssets} label="$" />}
        </div>
      )}

      <div
        className={clsx(
          'flex flex-col overflow-hidden rounded-xl bg-v1-surface-l1',
          containerClassName,
        )}
      >
        {data?.map((asset, ind, arr) => (
          <React.Fragment key={asset.slug}>
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
  const { data: tradingAssets } = useUserAssets();
  if (!isLoggedIn) return null;

  if (!tradingAssets?.length) return null;
  const totalAssets = tradingAssets?.reduce(
    (a, b) => a + (b.usd_equity ?? 0),
    0,
  );

  return (
    <div className={className}>
      <div className="id-title mb-3 gap-2 text-sm mobile:mb-5">
        {'Trading Assets' + (totalAssets > 0 ? ': ' : '')}
        {totalAssets > 0 && <ReadableNumber value={totalAssets} label="$" />}
      </div>

      <UserAssets data={tradingAssets} />
    </div>
  );
};

const UserWallets = (props: Props) => {
  const net = useActiveNetwork();
  const { data: walletAssets } = useUserWalletAssets(
    isMiniApp ? 'the-open-network' : 'solana',
  );

  return net === 'the-open-network' ? (
    <UserAssets title="Wallet Assets" data={walletAssets} {...props} />
  ) : (
    <div>
      <p className="text-v1-content-secondary my-3 text-xs">Wallets</p>
      <WalletSelector
        radioClassName="w-full [&.ant-radio-wrapper]:!items-start [&_.ant-radio]:!mt-4 [&_.ant-radio]:!self-start"
        WalletOptionComponent={WalletItem}
        expanded={props.expanded}
        className="-mr-2 -mt-3"
      />
    </div>
  );
};

export default function UserPortfolio(props: Props) {
  const isLoggedIn = useIsLoggedIn();
  if (!isLoggedIn) return null;

  return (
    <div className="p-3">
      <div className="flex flex-col gap-2">
        <UserTradingAssets />
        <UserWallets {...props} />
      </div>
    </div>
  );
}

function WalletItem({ wallet }: { wallet?: Wallet; expanded?: boolean }) {
  const { address, connected } = useConnectedWallet();
  const { address: activeAddress } = useActiveWallet();
  const { data: walletAssets } = useUserWalletAssets(
    isMiniApp ? 'the-open-network' : 'solana',
    wallet?.address ?? address,
  );
  const navigate = useNavigate();
  const { getUrl } = useDiscoveryRouteMeta();
  const [copy, notif] = useShare('copy');

  const isActive = (wallet ? wallet.address : address) === activeAddress;

  return (
    <div className="border-v1-inverse-overlay-10 w-full border-b py-3">
      <div className="mb-2 flex items-center justify-between">
        <div
          className={clsx(
            'flex items-center gap-2 text-xs font-medium',
            isActive && 'bg-brand-gradient bg-clip-text text-transparent',
          )}
        >
          <div className="flex items-center gap-1">
            {wallet ? wallet.name : 'Connected Wallet'}
            {(wallet?.address || address) && (
              <HoverTooltip title="Copy Wallet Address">
                <button
                  className="text-v1-content-secondary mt-1"
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
            onClick={() =>
              navigate(
                getUrl({ slug: wallet.key, detail: 'wallet', view: 'both' }),
              )
            }
            variant="outline"
            size="2xs"
            className="!bg-transparent !px-1"
          >
            Details
          </Button>
        ) : (
          <BtnAppKitWalletConnect
            network="solana"
            variant="outline"
            size="2xs"
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
  const { data: walletAssets } = useSolanaUserAssets(wallet.address);
  const { withdrawDepositModal, deposit } = useWalletActionHandler();

  if (!isLoggedIn) return null;

  return walletAssets?.length ? (
    <UserAssets data={walletAssets} />
  ) : (
    <div className="bg-v1-surface-l1 flex h-44 flex-col items-center justify-center rounded-xl">
      <DepositIcon className="size-8" />
      <p className="my-2 text-xxs">Deposit and start your trade journey</p>
      <Button size="xs" onClick={() => deposit(wallet.address)}>
        Deposit
      </Button>
      {withdrawDepositModal}
    </div>
  );
}
