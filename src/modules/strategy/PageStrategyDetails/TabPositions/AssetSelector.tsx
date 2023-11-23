import type React from 'react';
import ComboBox from 'shared/ComboBox';
import PairInfo from 'shared/PairInfo';
import { type Asset } from 'api';

const AssetOptionItem = (asset: Asset) => {
  if (!asset) {
    return (
      <div className="flex items-center justify-center p-2">Select Asset</div>
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
  assets?: Asset[];
  selectedItem?: Asset;
  onSelect?: (asset: Asset) => void;
  disabled?: boolean;
}

const AssetSelector: React.FC<Props> = ({
  assets = [],
  selectedItem,
  onSelect,
  disabled = false,
}) => {
  return (
    <ComboBox
      options={assets}
      selectedItem={selectedItem}
      onSelect={onSelect}
      renderItem={AssetOptionItem}
      disabled={disabled}
      className="w-[180px] !justify-start !px-2"
      optionClassName="!p-0"
    />
  );
};

export default AssetSelector;
