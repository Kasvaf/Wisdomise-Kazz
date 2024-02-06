import type React from 'react';
import { clsx } from 'clsx';
import ComboBox from 'shared/ComboBox';
import CoinsIcons from 'shared/CoinsIcons';
import { type SignalerPair } from 'api/signaler';

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
            <span className="text-lg font-semibold">
              {item.display_name ?? item.name}
            </span>
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
  loading?: boolean;
  coins?: SignalerPair[];
  selectedItem?: SignalerPair;
  onSelect?: (net: SignalerPair) => void;
  disabled?: boolean;
  className?: string;
}

const CoinSelector: React.FC<Props> = ({
  coins,
  selectedItem,
  onSelect,
  disabled = false,
  loading = false,
  className,
}) => {
  return (
    <ComboBox
      options={coins ?? []}
      selectedItem={loading ? 'Loading...' : selectedItem ?? 'Select Coin'}
      onSelect={onSelect}
      renderItem={CoinOptionItem}
      disabled={disabled || loading}
      className={clsx('h-[72px]', className)}
    />
  );
};

export default CoinSelector;
