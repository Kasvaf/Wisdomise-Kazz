import type React from 'react';
import { useEffect } from 'react';
import { type Asset } from 'api/builder';
import ComboBox from 'shared/ComboBox';
import PairInfo from 'shared/PairInfo';

const AssetOptionItem = (asset: Asset) => {
  if (!asset?.symbol) {
    return (
      <div className="flex items-center justify-start p-2 pl-6">
        {asset.display_name}
      </div>
    );
  }
  return (
    <PairInfo
      base={asset.symbol}
      name={asset.name}
      title={asset.display_name}
      className="!justify-start"
    />
  );
};

interface Props {
  label?: string;
  assets?: Asset[];
  selectedItem?: Asset;
  onSelect?: (asset: Asset) => void;
  disabled?: boolean;
  all?: boolean;
  placeholder?: string;
  className?: string;
  selectFirst?: boolean;
}

const ALL = {
  display_name: 'All assets',
  name: '',
  symbol: '',
};

const AssetSelector: React.FC<Props> = ({
  label,
  assets = [],
  selectedItem,
  onSelect,
  disabled = false,
  all,
  placeholder = label,
  className,
  selectFirst,
}) => {
  useEffect(() => {
    if (selectFirst && assets.length > 0 && !selectedItem) {
      onSelect?.(assets[0]);
    }
  }, [assets, onSelect, selectFirst, selectedItem]);

  return (
    <div className={className}>
      {label && <label className="mb-2 ml-4 block">{label}</label>}
      <ComboBox
        options={all ? [ALL, ...assets] : assets}
        selectedItem={
          selectedItem ?? (all ? ALL : { display_name: placeholder })
        }
        onSelect={onSelect}
        renderItem={AssetOptionItem}
        disabled={disabled}
        className="!justify-start !px-2"
        optionClassName="!p-0"
      />
    </div>
  );
};

export default AssetSelector;
