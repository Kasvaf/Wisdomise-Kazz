import { clsx } from 'clsx';
import React from 'react';
import { NavLink } from 'react-router-dom';
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

interface AssetData {
  slug: string;
  amount: number;
  network?: string;
  usd_equity?: number;
}

const UserAsset: React.FC<{ asset: AssetData }> = ({ asset }) => {
  const { getUrl } = useDiscoveryRouteMeta();
  const { data: baseInfo, isLoading: baseLoading } = useSymbolInfo(asset.slug);
  const [activeCoinSlug] = useSearchParamAsState('slug');

  return (
    <NavLink
      className={clsx(
        'flex items-center justify-between p-3 hover:bg-v1-background-hover',
        activeCoinSlug === asset.slug &&
          '!bg-v1-surface-l5 contrast-125 saturate-150',
      )}
      to={getUrl({
        detail: 'coin',
        slug: asset.slug,
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
  className?: string;
  containerClassName?: string;
}

const UserAssetsInternal: React.FC<
  Props & { title: string; data?: AssetData[] | null }
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
  const isMobile = useIsMobile();
  const isLoggedIn = useIsLoggedIn();

  const { data: tradingAssets, isLoading: loadingTraderAssets } =
    useUserAssets();
  const { data: walletAssets, isLoading: loadingWalletAssets } =
    useUserWalletAssets(isMiniApp ? 'the-open-network' : 'solana');

  if (
    !isLoggedIn ||
    (loadingTraderAssets && loadingWalletAssets) ||
    (!tradingAssets?.length && !walletAssets?.length)
  )
    return null;

  return (
    <div>
      <div className="flex flex-col gap-2">
        <UserAssetsInternal
          title="Trading Assets"
          data={tradingAssets}
          {...props}
        />
        {!isMobile && (
          <UserAssetsInternal
            title="Wallet Assets"
            data={walletAssets}
            {...props}
          />
        )}
      </div>
    </div>
  );
}
