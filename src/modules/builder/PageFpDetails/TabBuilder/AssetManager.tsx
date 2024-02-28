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
  const signalers =
    allSignalers?.filter(
      s => !fp?.market_name || s.market_name === fp?.market_name,
    ) ?? [];
  const signalerByKey = useMemo(
    () => Object.fromEntries(allSignalers?.map(s => [s.key, s]) ?? []),
    [allSignalers],
  );

  if (signalersLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (value.length === 0 && signalers.length === 0) return null;
  return (
    <div className="flex max-w-[550px] grow flex-col items-stretch rounded-xl bg-black/30 p-3">
      {value.map(a => (
        <div
          key={a.strategy}
          className="flex grow items-center gap-2 rounded-lg bg-black/30 p-2"
        >
          <SignalerSelector
            className="grow"
            signalers={signalers.filter(
              s =>
                s.key === a.strategy || !value.some(v => v.strategy === s.key),
            )}
            selectedItem={a.strategy}
            onSelect={strategy =>
              onChange(
                value.map(v =>
                  v.strategy === a.strategy ? { ...a, strategy } : v,
                ),
              )
            }
          />
          <AssetSelector
            assets={signalerByKey[a.strategy]?.assets}
            selectedItem={a.asset}
            onSelect={asset =>
              onChange(
                value.map(v =>
                  v.strategy === a.strategy ? { ...a, asset } : v,
                ),
              )
            }
            className="w-[168px]"
          />
          <AmountInputBox
            className="w-[50px]"
            value={String(a.share)}
            onChange={share =>
              onChange(
                value.map(v =>
                  v.strategy === a.strategy ? { ...a, share: +share } : v,
                ),
              )
            }
          />

          <div
            className="grow-0 cursor-pointer rounded-full p-2 hover:bg-white/5"
            onClick={() =>
              onChange(value.filter(x => x.strategy !== a.strategy))
            }
          >
            <Icon name={bxX} />
          </div>
        </div>
      ))}

      {signalers?.[0]?.assets?.[0] && (
        <Button
          className="mt-2 self-center"
          variant="alternative"
          onClick={() =>
            onChange([
              ...value,
              {
                strategy: signalers?.[0].key,
                asset: signalers?.[0].assets[0],
                share: 0,
              },
            ])
          }
        >
          New Asset
        </Button>
      )}
    </div>
  );
};

export default AssetManager;
