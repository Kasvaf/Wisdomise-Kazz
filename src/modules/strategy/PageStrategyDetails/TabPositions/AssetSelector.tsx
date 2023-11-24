import type React from 'react';
import ComboBox from 'shared/ComboBox';
import PairInfo from 'shared/PairInfo';
import { type Asset } from 'api';

const AssetOptionItem = (asset: Asset) => {
  if (!asset?.symbol) {
    return (
      <div className="flex items-center justify-start p-2 pl-6">All Assets</div>
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
  all?: boolean;
}

const ALL = {
  display_name: 'All assets',
  name: '',
  symbol: '',
};

const AssetSelector: React.FC<Props> = ({
  assets = [],
  selectedItem,
  onSelect,
  disabled = false,
  all,
}) => {
  return (
    <ComboBox
      options={all ? [ALL, ...assets] : assets}
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
