import type React from 'react';
import { clsx } from 'clsx';
import ComboBox from 'shared/ComboBox';
import CoinsIcons from 'shared/CoinsIcons';
import { type SignalerPair, useSignalerPairs } from 'api/signaler';

const CoinOptionItem = (item: SignalerPair | string) => {
  return (
    <div className="flex items-center">
      {typeof item === 'string' ? (
        item
      ) : (
        <>
          <CoinsIcons
            className="mr-2"
            coins={[item.base.name]}
            size={'large'}
          />
          <div className="">
            <span className="text-lg font-semibold">{item.display_name}</span>
            <span className="ml-1 text-xs text-white/40">
              {item.base.name}/{item.quote.name}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

interface Props {
  selectedItem: SignalerPair;
  onSelect?: (net: SignalerPair) => void;
  disabled?: boolean;
  className?: string;
}

const CoinSelector: React.FC<Props> = ({
  selectedItem,
  onSelect,
  disabled = false,
  className,
}) => {
  const coins = useSignalerPairs();

  return (
    <ComboBox
      options={coins.data ?? []}
      selectedItem={coins.isLoading ? 'Loading...' : selectedItem}
      onSelect={onSelect}
      renderItem={CoinOptionItem}
      disabled={disabled || coins.isLoading}
      className={clsx('h-[72px]', className)}
    />
  );
};

export default CoinSelector;
