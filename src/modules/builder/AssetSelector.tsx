import type React from 'react';
import { useEffect } from 'react';
import { type PairData } from 'api/types/strategy';
import ComboBox from 'shared/ComboBox';
import PairInfo from 'shared/PairInfo';

const AssetOptionItem = (asset: PairData) => {
  if (!asset?.name || !asset.base) {
    return (
      <div className="flex items-center justify-start p-2 pl-6">
        {asset.display_name}
      </div>
    );
  }

  return (
    <PairInfo
      base={asset.base.name}
      quote={asset.quote.name}
      title={asset.display_name}
      name={asset.name}
      className="!justify-start"
    />
  );
};

interface Props {
  label?: string;
  loading?: boolean;
  assets?: PairData[];
  selectedItem?: PairData;
  onSelect?: (asset: PairData) => void;
  disabled?: boolean;
  all?: boolean;
  placeholder?: string;
  className?: string;
  selectFirst?: boolean;
}

const ALL = { display_name: 'All assets' };
const AssetSelector: React.FC<Props> = ({
  label,
  loading,
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
    if (selectFirst && assets.length > 0 && !selectedItem && !loading) {
      onSelect?.(assets[0]);
    }
  }, [assets, loading, onSelect, selectFirst, selectedItem]);

  return (
    <div className={className}>
      {label && <label className="mb-2 ml-4 block">{label}</label>}
      <ComboBox
        options={all ? [ALL, ...assets] : assets}
        selectedItem={
          loading
            ? { display_name: 'Loading...' }
            : selectedItem ?? (all ? ALL : { display_name: placeholder })
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
