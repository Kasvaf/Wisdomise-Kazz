import { useMemo } from 'react';
import { bxX } from 'boxicons-quasar';
import {
  type MyFpAssets,
  useMyFinancialProductQuery,
  useMySignalersQuery,
} from 'api/builder';
import Button from 'shared/Button';
import AmountInputBox from 'shared/AmountInputBox';
import Icon from 'shared/Icon';
import Spinner from 'shared/Spinner';
import AssetSelector from '../../AssetSelector';
import SignalerSelector from './SignalerSelector';

interface Props {
  fpKey: string;
  value: MyFpAssets;
  onChange: (val: MyFpAssets) => void;
}

const AssetManager: React.FC<Props> = ({ fpKey, value, onChange }) => {
  const { data: allSignalers, isLoading: signalersLoading } =
    useMySignalersQuery();
  const { data: fp } = useMyFinancialProductQuery(fpKey);
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

  const usedPairs = useMemo(
    () => Object.fromEntries(value.map(v => [v.strategy + v.asset.name, true])),
    [value],
  );

  const nextItemToAdd = useMemo(() => {
    for (const s of signalers) {
      for (const asset of s.assets) {
        if (!usedPairs[s.key + asset.name]) {
          return {
            strategy: s.key,
            asset,
            share: Math.max(0, 100 - value.reduce((a, v) => a + v.share, 0)),
          };
        }
      }
    }
  }, [signalers, usedPairs, value]);

  function signalerUnusedAssets(signalerKey: string, assetName?: string) {
    return signalerByKey[signalerKey]?.assets?.filter(
      b => b.name === assetName || !usedPairs[signalerKey + b.name],
    );
  }

  if (signalersLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (value.length === 0 && signalers.length === 0) return null;
  return (
    <div className="flex max-w-[850px] grow flex-col items-stretch rounded-xl bg-black/30 p-3">
      {value.map(a => (
        <div
          key={a.strategy + a.asset.name}
          className="flex grow items-center gap-2 rounded-lg bg-black/30 p-2"
        >
          <SignalerSelector
            className="grow"
            signalers={signalers.filter(
              s =>
                s.key === a.strategy ||
                s.assets.some(a => !usedPairs[s.key + a.name]),
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
                          unusedAssets.find(x => x.name === a.asset.name) ??
                          unusedAssets[0],
                      }
                    : v,
                ),
              );
            }}
          />
          <AssetSelector
            assets={signalerUnusedAssets(a.strategy, a.asset.name)}
            selectedItem={a.asset}
            onSelect={asset =>
              onChange(value.map(v => (v === a ? { ...a, asset } : v)))
            }
            className="w-[220px]"
          />
          <AmountInputBox
            className="w-[50px]"
            value={String(a.share)}
            onChange={share =>
              onChange(value.map(v => (v === a ? { ...a, share: +share } : v)))
            }
          />

          <div
            className="grow-0 cursor-pointer rounded-full p-2 hover:bg-white/5"
            onClick={() => onChange(value.filter(x => x !== a))}
          >
            <Icon name={bxX} />
          </div>
        </div>
      ))}

      {nextItemToAdd && (
        <Button
          className="mt-2 self-center"
          variant="alternative"
          onClick={() => onChange([...value, nextItemToAdd])}
        >
          New Asset
        </Button>
      )}
    </div>
  );
};

export default AssetManager;
