import type { ExchangeTypes } from 'api';
import type React from 'react';
import ComboBox from 'shared/ComboBox';

// const exchangeIcons = {
//   WISDOMISE: WisdomiseLogoSvg,
//   BINANCE: BinanceLogoSvg,
// };

const ExchangeOptionItem = () => {
  // const Icon = exchangeIcons[item];
  return <div>{/* <Icon /> */}</div>;
};

interface Props {
  label?: string;
  className?: string;
  selectedItem: string;
  onSelect?: (net: ExchangeTypes) => void;
  disabled?: boolean;
  noWisdomise?: boolean;
}

const ExchangeSelector: React.FC<Props> = ({
  label,
  className,
  selectedItem,
  onSelect,
  disabled = false,
  noWisdomise = false,
}) => {
  const exchanges: ExchangeTypes[] = noWisdomise
    ? ['BINANCE']
    : ['WISDOMISE', 'BINANCE'];

  return (
    <div className={className}>
      {label && <label className="mb-2 ml-2 block">{label}</label>}

      <ComboBox
        disabled={disabled}
        onSelect={onSelect}
        options={exchanges}
        renderItem={ExchangeOptionItem}
        selectedItem={selectedItem}
      />
    </div>
  );
};

export default ExchangeSelector;
