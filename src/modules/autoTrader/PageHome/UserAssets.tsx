import React from 'react';
import { type UserAssetPair, useUserAssets } from 'api';
import { roundSensible } from 'utils/numbers';
import { useSymbolInfo } from 'api/symbol';
import Spin from 'shared/Spin';

const UserAsset: React.FC<{ pair: UserAssetPair }> = ({ pair }) => {
  const [base, _] = pair.pair_slug.split('/');
  const { data: baseInfo, isLoading: baseLoading } = useSymbolInfo(base);

  return (
    <div className="flex items-center justify-between">
      {baseInfo ? (
        <div className="flex items-start">
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
              ${roundSensible(pair.usd_equity / pair.amount)}
            </div>
          </div>
        </div>
      ) : baseLoading ? (
        <Spin />
      ) : (
        <div />
      )}
      <div>
        <div className="text-xs font-medium">{roundSensible(pair.amount)}</div>
        <div className="text-xxs font-normal text-v1-content-secondary">
          ${roundSensible(pair.usd_equity)}
        </div>
      </div>
    </div>
  );
};

const UserAssets: React.FC<{ className?: string }> = ({ className }) => {
  const { data: assets, isLoading } = useUserAssets();
  if (isLoading) return null;

  const totalAssets = assets?.reduce((a, b) => a + b.usd_equity, 0);

  return (
    <div className={className}>
      <div className="mb-4 flex justify-center text-3xl font-semibold">
        $ {roundSensible(totalAssets)}
      </div>

      <div className="rounded-xl bg-v1-surface-l2 p-4">
        {assets?.map((pair, ind) => (
          <React.Fragment key={pair.pair_slug}>
            <UserAsset pair={pair} />

            {ind !== assets.length - 1 && (
              <div className="my-3 border-b border-b-white/5" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default UserAssets;
