import { clsx } from 'clsx';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { type UserAssetPair, useUserAssets } from 'api';
import { roundSensible } from 'utils/numbers';
import { useSymbolInfo } from 'api/symbol';
import Spin from 'shared/Spin';
import { ReadableNumber } from 'shared/ReadableNumber';
import { useIsLoggedIn } from 'modules/base/auth/jwt-store';

const UserAsset: React.FC<{ asset: UserAssetPair }> = ({ asset }) => {
  const { data: baseInfo, isLoading: baseLoading } = useSymbolInfo(asset.slug);

  return (
    <NavLink
      className="flex items-center justify-between"
      to={`/trader/positions?slug=${asset.slug}`}
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
            <div className="text-xxs font-normal text-v1-content-secondary">
              ${roundSensible(asset.usd_equity / asset.amount)}
            </div>
          </div>
        </div>
      ) : baseLoading ? (
        <Spin />
      ) : (
        <div />
      )}
      <div className="text-end">
        <div className="text-xs font-medium">{roundSensible(asset.amount)}</div>
        <div className="text-xxs font-normal text-v1-content-secondary">
          ${roundSensible(asset.usd_equity)}
        </div>
      </div>
    </NavLink>
  );
};

interface Props {
  noTotal?: boolean;
  className?: string;
  containerClassName?: string;
}

const UserAssetsInternal: React.FC<Props> = ({
  noTotal,
  className,
  containerClassName,
}) => {
  const { data: assets, isLoading } = useUserAssets();

  const totalAssets = assets?.reduce((a, b) => a + b.usd_equity, 0);
  if (isLoading || !assets?.length) return null;

  return (
    <div className={className}>
      {!noTotal && (
        <div className="mb-4 flex justify-center text-2xl font-semibold">
          <ReadableNumber value={totalAssets} label="$" />
        </div>
      )}

      <div
        className={clsx(
          'flex flex-col gap-3 rounded-xl bg-v1-surface-l2 p-4',
          containerClassName,
        )}
      >
        {assets?.map((asset, ind, arr) => (
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
  if (!isLoggedIn) return null;
  return <UserAssetsInternal {...props} />;
}
