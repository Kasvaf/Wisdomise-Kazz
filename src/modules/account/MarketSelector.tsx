import type React from 'react';
import { type MarketTypes } from 'api/types/shared';
import ComboBox from 'shared/ComboBox';

const MarketOptionItem = (item: MarketTypes) => {
  return <div>{item}</div>;
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
      {label && <label className="mb-2 ml-2 block">{label}</label>}

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
