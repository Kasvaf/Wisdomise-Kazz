import { clsx } from 'clsx';
import { Dropdown } from 'antd';
import { bxPlus, bxX } from 'boxicons-quasar';
import { type ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import { useAllowedAssetsQuery, type StrategyAsset, type Asset } from 'api';
import DropdownContainer from 'shared/DropdownContainer';
import Icon from 'shared/Icon';
import Button from 'shared/Button';
import PairInfo from 'shared/PairInfo';
import CoinsIcons from 'shared/CoinsIcons';
import TitleHint from '../../TitleHint';

interface Props {
  strategyKey: string;
  value: StrategyAsset[];
  onChange: (assets: StrategyAsset[]) => unknown;
  className?: string;
  error?: string | boolean;
}

const AssetButton: React.FC<{ asset: Asset; onSelect: (a: Asset) => void }> = ({
  asset,
  onSelect,
}) => {
  const clickHandler = useCallback(() => onSelect(asset), [onSelect, asset]);
  return (
    <Button
      variant="alternative"
      contentClassName="!justify-start"
      onClick={clickHandler}
    >
      <div className="flex items-center">
        <CoinsIcons coins={[asset.symbol]} />
        <div className="ml-2 text-left">
          <div>{asset.display_name}</div>
          <div className="text-xs text-white/50">{asset.name}</div>
        </div>
      </div>
    </Button>
  );
};

const StrategyAssetItem: React.FC<{
  strategyAsset: StrategyAsset;
  onRemove: (ass: StrategyAsset) => void;
  onUpdateShare: (ass: StrategyAsset, value: number) => void;
}> = ({ strategyAsset: ab, onRemove, onUpdateShare }) => {
  const removeHandler = useCallback(() => onRemove(ab), [onRemove, ab]);
  const updateShareHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    e => {
      const val = +(e.target as HTMLInputElement).value;
      if (!Number.isNaN(val) && val >= 0 && val <= 100) {
        onUpdateShare(ab, val);
      }
      e.target.value = String(val);
    },
    [ab, onUpdateShare],
  );

  return (
    <div
      key={ab.asset.name}
      className="flex items-center justify-between rounded-lg bg-black/20 p-4"
    >
      <PairInfo
        base={ab.asset.symbol}
        quote={ab.asset.name.split('/')[1]}
        title="Bitcoin"
      />

      <div className="flex items-center">
        <input
          className="inline-block w-10 rounded-lg bg-black/60 p-2"
          value={ab.share}
          onInput={updateShareHandler}
        />
        <span className="ml-1">%</span>
      </div>

      <div
        onClick={removeHandler}
        className={clsx(
          'rounded-full p-1',
          'cursor-pointer text-white hover:bg-black/70',
        )}
      >
        <Icon name={bxX} />
      </div>
    </div>
  );
};

const PartAssets: React.FC<Props> = ({
  value,
  className,
  strategyKey,
  onChange,
  error,
}) => {
  const [coinsOpen, setCoinsOpen] = useState(false);
  const { data: assets } = useAllowedAssetsQuery(strategyKey);
  const sharesSum = value.reduce((a, b) => a + b.share, 0);
  const addAssetHandler = useCallback(
    (asset: Asset) => {
      onChange([...value, { asset, share: 100 - sharesSum }]);
    },
    [value, onChange, sharesSum],
  );

  const removeAssetHandler = useCallback(
    (asset: StrategyAsset) => {
      onChange(value.filter(x => x.asset.name !== asset.asset.name));
    },
    [value, onChange],
  );

  const updateShareHandler = useCallback(
    (ass: StrategyAsset, share: number) => {
      onChange(
        value.map(x => (x.asset.name === ass.asset.name ? { ...x, share } : x)),
      );
    },
    [value, onChange],
  );

  const unusedAssets = useMemo(
    () =>
      assets?.filter(ass => !value.some(x => x.asset.name === ass.name)) ?? [],
    [assets, value],
  );

  const dropDownFn = useCallback(
    () => (
      <DropdownContainer
        className="min-w-[180px] bg-[#272A32] !p-2"
        setOpen={setCoinsOpen}
      >
        <div className="mb-3 text-center text-white">Add Coin</div>
        <div className="flex flex-col">
          {unusedAssets.map(ass => (
            <AssetButton
              key={ass.name}
              asset={ass}
              onSelect={addAssetHandler}
            />
          ))}
        </div>
      </DropdownContainer>
    ),
    [addAssetHandler, unusedAssets],
  );

  return (
    <section className={className}>
      <div className="flex items-center justify-between">
        <TitleHint title="Assets">
          Choose a cryptocurrency and percentage to trade
        </TitleHint>

        {unusedAssets.length > 0 && (
          <Dropdown
            open={coinsOpen}
            trigger={['click']}
            onOpenChange={setCoinsOpen}
            placement="bottomRight"
            dropdownRender={dropDownFn}
          >
            <Button variant="secondary">
              <span className="mr-2">Add Coin</span>
              <Icon name={bxPlus} />
            </Button>
          </Dropdown>
        )}
      </div>

      <div className="mt-6 grid grid-cols-4 gap-6">
        {value.map(ab => (
          <StrategyAssetItem
            key={ab.asset.name}
            strategyAsset={ab}
            onRemove={removeAssetHandler}
            onUpdateShare={updateShareHandler}
          />
        ))}
      </div>
      {error && <div className="ml-2 mt-2 text-xs text-error">{error}</div>}
    </section>
  );
};

export default PartAssets;
