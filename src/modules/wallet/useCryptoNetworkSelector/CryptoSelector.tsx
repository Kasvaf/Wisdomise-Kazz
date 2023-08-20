import type React from 'react';
import ComboBox from 'shared/ComboBox';
import { CoinsIcons } from 'shared/CoinsIcons';
import { type Quote } from 'api/types/investorAssetStructure';

const CryptoOptionItem = (item: Quote) => {
  return (
    <div className="flex items-center">
      <div className="my-2 mr-2 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white">
        <CoinsIcons coins={[item.name]} size={'small'} />
      </div>
      <div className="text-lg font-semibold">{item.name}</div>
    </div>
  );
};

interface Props {
  cryptos?: Quote[];
  selectedItem: Quote;
  onSelect: (net: Quote) => void;
  disabled?: boolean;
}

const CryptoSelector: React.FC<Props> = ({
  cryptos = [],
  selectedItem,
  onSelect,
  disabled = false,
}) => {
  return (
    <ComboBox
      options={cryptos}
      selectedItem={selectedItem}
      onSelect={onSelect}
      renderItem={CryptoOptionItem}
      disabled={disabled}
    />
  );
};

export default CryptoSelector;
