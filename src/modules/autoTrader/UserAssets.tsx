import { clsx } from 'clsx';
import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { bxCopy, bxEdit, bxLinkExternal, bxTransfer } from 'boxicons-quasar';
import { useUserAssets } from 'api';
import { useSymbolInfo } from 'api/symbol';
import { useUserWalletAssets } from 'api/chains';
import { roundSensible } from 'utils/numbers';
import { isMiniApp } from 'utils/version';
import useIsMobile from 'utils/useIsMobile';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import Spin from 'shared/Spin';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { useActiveNetwork } from 'modules/base/active-network';
import { useUpdateWalletMutation, type Wallet } from 'api/wallets';
import { useWalletActionHandler } from 'modules/base/wallet/useWalletActionHandler';
import Badge from 'shared/Badge';
import { shortenAddress } from 'utils/shortenAddress';
import { HoverTooltip } from 'shared/HoverTooltip';
import { SCANNERS } from 'modules/autoTrader/PageTransactions/TransactionBox/components';
import { BtnAppKitWalletConnect } from 'modules/base/wallet/BtnAppkitWalletConnect';
import { useSolanaUserAssets } from 'api/chains/solana';
import { ReactComponent as DepositIcon } from 'modules/base/wallet/deposit.svg';
import { useActiveClientWallet, useActiveWallet } from 'api/chains/wallet';
import { useShare } from 'shared/useShare';
// eslint-disable-next-line import/max-dependencies
import { WalletSelector } from 'modules/base/wallet/BtnSolanaWallets';

interface AssetData {
  slug: string;
  amount: number;
  network?: string;
  usd_equity?: number;
}

const UserAsset: React.FC<{ asset: AssetData }> = ({ asset }) => {
  const isMobile = useIsMobile();
  const { getUrl, params } = useDiscoveryRouteMeta();
  const { data: baseInfo, isLoading: baseLoading } = useSymbolInfo(asset.slug);
  const [activeCoinSlug] = useSearchParamAsState('slug');

  return (
    <NavLink
      className={clsx(
        'flex items-center justify-between p-3 !text-v1-content-primary hover:bg-v1-background-hover',
        activeCoinSlug === asset.slug &&
          '!bg-v1-surface-l5 contrast-125 saturate-150',
      )}
      to={getUrl({
        detail: 'coin',
        slug: asset.slug,
        view:
          params.view === 'list' ? (isMobile ? 'detail' : 'both') : params.view,
      })}
    >
      {baseInfo ? (
        <div className="flex items-center">
          {baseInfo?.logo_url ? (
            <img
              className="mr-1.5 size-[24px] rounded-full"
              src={baseInfo.logo_url}
            />
          ) : (
            <div className="mr-1.5 size-[24px]" />
          )}

          <div>
            <div className="text-xs font-medium">{baseInfo?.abbreviation}</div>
            {asset.usd_equity != null && (
              <div className="text-xxs font-normal text-v1-content-secondary">
                ${roundSensible(asset.usd_equity / asset.amount)}
              </div>
            )}
          </div>
        </div>
      ) : baseLoading ? (
        <Spin />
      ) : (
        <div />
      )}
      <div className="text-end">
        <div className="text-xs font-medium">{roundSensible(asset.amount)}</div>
        {asset.usd_equity != null && (
          <div className="text-xxs font-normal text-v1-content-secondary">
            ${roundSensible(asset.usd_equity)}
          </div>
        )}
      </div>
    </NavLink>
  );
};

interface Props {
  noTotal?: boolean;
  onlyTradingAssets?: boolean;
  className?: string;
  containerClassName?: string;
}

export const UserAssetsInternal: React.FC<
  Props & { title?: string; data?: AssetData[] | null }
> = ({ title, data, className, containerClassName }) => {
  if (!data?.length) return null;
  const totalAssets = data?.reduce((a, b) => a + (b.usd_equity ?? 0), 0);
  return (
    <div className={className}>
      {(totalAssets > 0 || title) && (
        <div className="id-title mb-1 flex justify-center gap-2 text-sm">
          {title ? title + (totalAssets > 0 ? ': ' : '') : ' '}
          {totalAssets > 0 && <ReadableNumber value={totalAssets} label="$" />}
        </div>
      )}

      <div
        className={clsx(
          'flex flex-col overflow-hidden rounded-xl bg-v1-surface-l2',
          containerClassName,
        )}
      >
        {data?.map((asset, ind, arr) => (
          <React.Fragment key={asset.slug}>
            <UserAsset asset={asset} />

            {ind !== arr.length - 1 && (
              <div className="border-b border-b-white/5" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default function UserAssets(props: Props) {
  const isLoggedIn = useIsLoggedIn();
  const net = useActiveNetwork();

  const { data: tradingAssets } = useUserAssets();
  const { data: walletAssets } = useUserWalletAssets(
    isMiniApp ? 'the-open-network' : 'solana',
  );

  if (!isLoggedIn) return null;

  return (
    <div>
      <div className="flex flex-col gap-2">
        <UserAssetsInternal
          title="Trading Assets"
          data={tradingAssets}
          {...props}
        />
        {!props.onlyTradingAssets &&
          (net === 'the-open-network' ? (
            <UserAssetsInternal
              title="Wallet Assets"
              data={walletAssets}
              {...props}
            />
          ) : (
            <WalletSelector
              radioClassName="w-full [&.ant-radio-wrapper]:items-start [&_.ant-radio]:mt-7 [&_.ant-radio]:self-start"
              WalletOptionComponent={WalletItem}
              className="-mt-3"
            />
          ))}
      </div>
    </div>
  );
}

function WalletItem({ wallet }: { wallet?: Wallet }) {
  const { address, connected, name, icon } = useActiveClientWallet();
  const { address: activeAddress } = useActiveWallet();
  const { data: walletAssets } = useUserWalletAssets(
    isMiniApp ? 'the-open-network' : 'solana',
    wallet?.address ?? address,
  );
  const [newName, setNewName] = useState(wallet?.name ?? '');
  const [editMode, setEditMode] = useState(false);
  const { mutate } = useUpdateWalletMutation(wallet?.key);
  const inputRef = useRef<HTMLInputElement>(null);
  const [copy, notif] = useShare('copy');

  const isActive = (wallet ? wallet.address : address) === activeAddress;

  const updateName = () => {
    if (newName && wallet) {
      mutate({ name: newName });
      wallet.name = newName;
    } else {
      setNewName(wallet?.name ?? '');
    }
    setEditMode(false);
  };

  return (
    <div className="w-full border-b border-v1-inverse-overlay-10 py-3">
      <div
        className={clsx(
          'flex items-center gap-2 font-medium',
          isActive && 'bg-pro-gradient bg-clip-text text-transparent',
        )}
      >
        {wallet ? (
          editMode ? (
            <input
              ref={inputRef}
              className="bg-transparent"
              defaultValue={newName}
              onChange={e => setNewName(e.target.value)}
              onBlur={updateName}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  updateName();
                }
              }}
            />
          ) : (
            <div className="flex items-center gap-1">
              <span>{wallet.name}</span>
              <HoverTooltip className="h-4" title="Rename" ignoreFocus>
                <button
                  onClick={() => {
                    setEditMode(prev => !prev);
                    setTimeout(() => inputRef.current?.select(), 0);
                  }}
                  className="text-v1-content-secondary"
                >
                  <Icon name={bxEdit} size={16} />
                </button>
              </HoverTooltip>
            </div>
          )
        ) : (
          'Connected Wallet'
        )}
        {isActive && <Badge color="pro" label="Active" />}
      </div>
      <div className="mb-2 flex items-center gap-1 text-xxs text-v1-inverse-overlay-50">
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
              <img src={icon} className="size-4" /> {name}
            </div>
          ) : (
            'Not Connected'
          )}
        </div>
        <div className="ml-auto">
          {wallet ? (
            <WalletActions wallet={wallet} />
          ) : (
            <BtnAppKitWalletConnect
              network="solana"
              variant="outline"
              size="2xs"
            />
          )}
        </div>
      </div>
      {wallet ? (
        <WalletAssets wallet={wallet} />
      ) : (
        connected && <UserAssetsInternal data={walletAssets} />
      )}
      {notif}
    </div>
  );
}

function WalletActions({ wallet }: { wallet: Wallet }) {
  const { withdrawDepositModal, deposit, withdraw, transfer, openScan } =
    useWalletActionHandler();

  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={() => withdraw(wallet.address)}
        variant="outline"
        size="2xs"
        className="!bg-transparent !px-1"
      >
        Withdraw
      </Button>
      <Button
        onClick={() => deposit(wallet.address)}
        variant="outline"
        size="2xs"
        className="!bg-transparent !px-1"
      >
        Deposit
      </Button>
      <HoverTooltip title="Transfer">
        <button
          onClick={() => transfer(wallet.address)}
          className="mt-1 text-v1-content-secondary"
        >
          <Icon name={bxTransfer} size={16} />
        </button>
      </HoverTooltip>
      <HoverTooltip title={`View on ${SCANNERS[wallet.network_slug].name}`}>
        <button
          className="mt-1 text-v1-content-secondary"
          onClick={() => openScan(wallet)}
        >
          <Icon name={bxLinkExternal} size={16} />
        </button>
      </HoverTooltip>
      {withdrawDepositModal}
    </div>
  );
}

export function WalletAssets({ wallet }: { wallet: Wallet }) {
  const isLoggedIn = useIsLoggedIn();
  const { data: custodialWalletAssets } = useSolanaUserAssets(wallet.address);
  const { withdrawDepositModal, deposit } = useWalletActionHandler();

  if (!isLoggedIn) return null;

  return custodialWalletAssets?.length ? (
    <UserAssetsInternal data={custodialWalletAssets} />
  ) : (
    <div className="flex h-44 flex-col items-center justify-center rounded-xl bg-v1-surface-l2">
      <DepositIcon className="size-8" />
      <p className="my-2 text-xxs">Deposit and start your trade journey</p>
      <Button size="xs" onClick={() => deposit(wallet.address)}>
        Deposit
      </Button>
      {withdrawDepositModal}
    </div>
  );
}
