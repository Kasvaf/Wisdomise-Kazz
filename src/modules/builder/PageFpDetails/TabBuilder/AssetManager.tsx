import { useMemo } from 'react';
import { bxX } from 'boxicons-quasar';
import { NavLink } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useSignalerPair } from 'api';
import {
  type MyFpAssets,
  useMyFinancialProductQuery,
  useMySignalersQuery,
} from 'api/builder';
import Button from 'shared/Button';
import AmountInputBox from 'shared/AmountInputBox';
import Icon from 'shared/Icon';
import Banner from 'shared/Banner';
import Spinner from 'shared/Spinner';
import AssetSelector from '../../AssetSelector';
import SignalerSelector from './SignalerSelector';

interface Props {
  fpKey: string;
  value: MyFpAssets;
  onChange: (val: MyFpAssets) => void;
}

const AssetManager: React.FC<Props> = ({ fpKey, value = [], onChange }) => {
  const { t } = useTranslation('builder');
  const { data: allSignalers, isLoading: signalersLoading } =
    useMySignalersQuery();
  const { data: fp } = useMyFinancialProductQuery(fpKey);
  const pairByName = useSignalerPair(fp?.market_name ?? 'FUTURES');
  const signalers = useMemo(
    () =>
      allSignalers?.filter(
        s => !fp?.market_name || s.market_name === fp?.market_name,
      ) ?? [],
    [allSignalers, fp?.market_name],
  );
  const signalerByKey = useMemo(
    () => Object.fromEntries(allSignalers?.map(s => [s.key, s]) ?? []),
    [allSignalers],
  );

  const usedCoins = useMemo(
    () => Object.fromEntries(value.map(v => [v.asset.base.name, true])),
    [value],
  );

  const nextItemToAdd = useMemo(() => {
    for (const s of signalers) {
      for (const asset of s.assets) {
        if (!usedCoins[asset.base.name]) {
          return {
            strategy: s.key,
            asset,
            share: Math.max(0, 100 - value.reduce((a, v) => a + v.share, 0)),
          };
        }
      }
    }
  }, [signalers, usedCoins, value]);

  function signalerUnusedAssets(signalerKey: string, assetName?: string) {
    return signalerByKey[signalerKey]?.assets?.filter(
      b => b.base.name === assetName || !usedCoins[b.base.name],
    );
  }

  if (signalersLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (value.length === 0 && signalers.length === 0) {
    return (
      <Banner className="">
        <Trans ns="builder" i18nKey="asset-manager.banner">
          You haven&apos;t created any
          <NavLink to="/builder/signalers" className="text-info">
            Signlers
          </NavLink>
          to use in your product yet.
        </Trans>
      </Banner>
    );
  }

  return (
    <div className="flex min-w-[320px] max-w-[850px] grow flex-col items-stretch gap-2 rounded-xl bg-black/30 p-3">
      {value.map(a => (
        <div
          key={a.strategy + a.asset.base.name}
          className="flex grow items-center gap-2 rounded-lg bg-black/30 p-2 mobile:flex-col mobile:items-stretch"
        >
          <SignalerSelector
            className="grow"
            signalers={signalers.filter(
              s =>
                s.key === a.strategy ||
                s.assets.some(a => !usedCoins[a.base.name]),
            )}
            selectedItem={a.strategy}
            onSelect={strategy => {
              const unusedAssets = signalerUnusedAssets(strategy);
              onChange(
                value.map(v =>
                  v === a
                    ? {
                        ...a,
                        strategy,
                        asset:
                          unusedAssets.find(
                            x => x.base.name === a.asset.base.name,
                          ) ?? unusedAssets[0],
                      }
                    : v,
                ),
              );
            }}
          />
          <AssetSelector
            assets={signalerUnusedAssets(a.strategy, a.asset.base.name).map(
              x => x.base.name,
            )}
            selectedItem={a.asset.name}
            onSelect={assetName => {
              const asset = pairByName(assetName);
              if (asset) {
                onChange(value.map(v => (v === a ? { ...a, asset } : v)));
              }
            }}
            market={fp?.market_name}
            className="w-[220px] mobile:w-full"
          />
          <AmountInputBox
            className="w-[50px] mobile:w-full"
            value={String(a.share)}
            onChange={share =>
              onChange(value.map(v => (v === a ? { ...a, share: +share } : v)))
            }
          />

          <div
            className="flex grow-0 cursor-pointer items-center rounded-full p-2 hover:bg-white/5 mobile:self-center"
            onClick={() => onChange(value.filter(x => x !== a))}
          >
            <Icon name={bxX} />
            <span className="mr-2 hidden mobile:block">
              {t('common:actions.remove')}
            </span>
          </div>
        </div>
      ))}

      {nextItemToAdd && (
        <Button
          className="mt-2 self-center"
          variant="alternative"
          onClick={() => onChange([...value, nextItemToAdd])}
        >
          {t('asset-manager.btn-new-asset')}
        </Button>
      )}
    </div>
  );
};

export default AssetManager;
