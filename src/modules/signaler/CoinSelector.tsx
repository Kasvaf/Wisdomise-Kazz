import type React from 'react';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { type PairData } from 'api/types/strategy';
import ComboBox from 'shared/ComboBox';
import CoinsIcons from 'shared/CoinsIcons';

const CoinOptionItem = (item: PairData | string) => {
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
  coins?: PairData[];
  selectedItem?: PairData;
  onSelect?: (net: PairData) => void;
  disabled?: boolean;
  loading?: boolean;
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
  const { t } = useTranslation('strategy');
  useEffect(() => {
    if (!coins) return;
    if (!selectedItem || !coins?.find(c => c.name === selectedItem.name)) {
      onSelect?.(coins[0]);
    }
  }, [coins, onSelect, selectedItem]);

  return (
    <ComboBox
      options={coins ?? []}
      selectedItem={loading ? 'Loading...' : selectedItem ?? t('select-coin')}
      onSelect={onSelect}
      renderItem={CoinOptionItem}
      disabled={disabled || loading}
      className={clsx('h-[72px]', className)}
    />
  );
};

export default CoinSelector;
