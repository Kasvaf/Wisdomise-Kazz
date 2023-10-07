import type React from 'react';
import ComboBox from 'shared/ComboBox';
import { type MarketTypes } from 'api';

const MarketOptionItem = (item: MarketTypes) => {
  return <div>{item.toLowerCase()}</div>;
};

interface Props {
  label?: string;
  className?: string;
  selectedItem: string;
  onSelect?: (net: MarketTypes) => void;
  disabled?: boolean;
}

const MarketSelector: React.FC<Props> = ({
  label,
  className,
  selectedItem,
  onSelect,
  disabled = false,
}) => {
  const markets: MarketTypes[] = ['SPOT', 'FUTURES'];
  return (
    <div className={className}>
      {label && <label className="mb-2 ml-4 block">{label}</label>}

      <ComboBox
        options={markets}
        selectedItem={selectedItem}
        onSelect={onSelect}
        renderItem={MarketOptionItem}
        disabled={disabled}
      />
    </div>
  );
};

export default MarketSelector;
