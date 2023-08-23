import type React from 'react';
import { type Network } from 'api/types/NetworksResponse';
import ComboBox from 'shared/ComboBox';

const NetworkOptionItemFn = (item: Network) => {
  return (
    <div className="flex flex-col justify-center">
      <div className="font-medium leading-normal">{item.name}</div>
      <div className="text-[10px] leading-normal text-white/80">
        {item.description}
      </div>
    </div>
  );
};

interface Props {
  networks?: Network[];
  selectedItem: Network;
  onSelect: (net: Network) => void;
  disabled: boolean;
}

const NetworkSelector: React.FC<Props> = ({
  networks = [],
  selectedItem,
  onSelect,
  disabled,
}) => {
  return (
    <ComboBox
      options={networks}
      selectedItem={selectedItem}
      onSelect={onSelect}
      renderItem={NetworkOptionItemFn}
      disabled={disabled}
    />
  );
};

export default NetworkSelector;
