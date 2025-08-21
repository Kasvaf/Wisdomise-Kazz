import type { Network } from 'api/types/NetworksResponse';
import type React from 'react';
import ComboBox from 'shared/ComboBox';

const NetworkOptionItemFn = (item: Network) => {
  return (
    <div className="flex flex-col justify-center">
      <div className="font-medium leading-normal">{item.name}</div>
      <div className="text-[10px] text-white/80 leading-normal">
        {item.description}
      </div>
    </div>
  );
};

interface Props {
  disabled?: boolean;
  networks?: Network[];
  selectedItem: Network;
  onSelect?: (net: Network) => void;
}

const NetworkSelector: React.FC<Props> = ({
  networks = [],
  selectedItem,
  onSelect,
  disabled,
}) => {
  return (
    <ComboBox
      disabled={disabled}
      onSelect={onSelect}
      options={networks}
      renderItem={NetworkOptionItemFn}
      selectedItem={selectedItem}
    />
  );
};

export default NetworkSelector;
