import type React from 'react';
import ComboBox from 'shared/ComboBox';
import { ReactComponent as WisdomiseLogoSvg } from 'assets/logo-horizontal-beta.svg';
import { ReactComponent as BinanceLogoSvg } from 'assets/logo-binance.svg';
import { type ExchangeTypes } from 'api';

const exchangeIcons = {
  WISDOMISE: WisdomiseLogoSvg,
  BINANCE: BinanceLogoSvg,
};

const ExchangeOptionItem = (item: ExchangeTypes) => {
  const Icon = exchangeIcons[item];
  return (
    <div>
      <Icon />
    </div>
  );
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
      {label && <label className="mb-2 ml-4 block">{label}</label>}

      <ComboBox
        options={exchanges}
        selectedItem={selectedItem}
        onSelect={onSelect}
        renderItem={ExchangeOptionItem}
        disabled={disabled}
      />
    </div>
  );
};

export default ExchangeSelector;
