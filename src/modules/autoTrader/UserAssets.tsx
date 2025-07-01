import { clsx } from 'clsx';
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { bxCopy } from 'boxicons-quasar';
import { useUserAssets } from 'api';
import { useSymbolInfo } from 'api/symbol';
import { useUserWalletAssets } from 'api/chains';
import { roundSensible } from 'utils/numbers';
import { isMiniApp } from 'utils/version';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import Spin from 'shared/Spin';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { useActiveNetwork } from 'modules/base/active-network';
import { type Wallet } from 'api/wallets';
import { useWalletActionHandler } from 'modules/base/wallet/useWalletActionHandler';
import Badge from 'shared/Badge';
import { HoverTooltip } from 'shared/HoverTooltip';
import { BtnAppKitWalletConnect } from 'modules/base/wallet/BtnAppkitWalletConnect';
import { useSolanaUserAssets } from 'api/chains/solana';
import { ReactComponent as DepositIcon } from 'modules/base/wallet/deposit.svg';
import { useConnectedWallet, useActiveWallet } from 'api/chains/wallet';
import { useShare } from 'shared/useShare';
import { WalletSelector } from 'modules/base/wallet/BtnSolanaWallets';
import { Coin } from 'shared/Coin';
// eslint-disable-next-line import/max-dependencies
import useIsMobile from 'utils/useIsMobile';

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
        'flex items-center justify-between px-4 py-2 !text-v1-content-primary hover:!bg-v1-surface-l4',
        activeCoinSlug === asset.slug && '!bg-v1-surface-l3',
      )}
      to={getUrl({
        detail: 'coin',
        slug: asset.slug,
        view:
          params.view === 'list' ? (isMobile ? 'detail' : 'both') : params.view,
      })}
    >
      {baseInfo ? (
        <Coin
          coin={baseInfo}
          className="text-xs"
          imageClassName="size-7"
          nonLink
        />
      ) : baseLoading ? (
        <Spin />
      ) : (
        <div />
      )}
      <div className="text-end">
        <div className="text-xs font-medium">{roundSensible(asset.amount)}</div>
        {asset.usd_equity !== 0 && (
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
  expanded?: boolean;
  containerClassName?: string;
}

export const UserAssetsInternal: React.FC<
  Props & { title?: string; data?: AssetData[] | null; showTotal?: boolean }
> = ({ title, data, className, containerClassName, showTotal }) => {
  if (!data?.length) return null;
  const totalAssets = data?.reduce((a, b) => a + (b.usd_equity ?? 0), 0);
  return (
    <div className={className}>
      {(totalAssets > 0 || title) && showTotal && (
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
              <div className="mx-4 border-b border-b-white/5" />
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
          showTotal
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
            <div>
              <p className="my-3 text-xs text-v1-content-secondary">Wallets</p>
              <WalletSelector
                radioClassName="w-full [&.ant-radio-wrapper]:items-start [&_.ant-radio]:mt-4 [&_.ant-radio]:self-start"
                WalletOptionComponent={WalletItem}
                expanded={props.expanded}
                className="-mr-2 -mt-3"
              />
            </div>
          ))}
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
    <div className="w-full border-b border-v1-inverse-overlay-10 py-3">
      <div className="mb-2 flex items-center justify-between">
        <div
          className={clsx(
            'flex items-center gap-2 text-xs font-medium',
            isActive && 'bg-pro-gradient bg-clip-text text-transparent',
          )}
        >
          {wallet ? (
            <div className="flex items-center gap-1">
              {wallet.name}
              <HoverTooltip title="Copy Wallet Address">
                <button
                  className="mt-1 text-v1-content-secondary"
                  onClick={() => copy(wallet.address)}
                >
                  <Icon name={bxCopy} size={16} />
                </button>
              </HoverTooltip>
            </div>
          ) : (
            'Connected Wallet'
          )}
          {isActive && <Badge color="pro" label="Active" />}
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
        connected && <UserAssetsInternal data={walletAssets} />
      )}
      {notif}
    </div>
  );
}

function WalletAssets({ wallet }: { wallet: Wallet }) {
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
