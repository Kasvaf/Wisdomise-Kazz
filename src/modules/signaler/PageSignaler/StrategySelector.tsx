import type React from 'react';
import { clsx } from 'clsx';
import ComboBox from 'shared/ComboBox';
import { useStrategiesList, type StrategyItem } from 'api/signaler';

const CoinOptionItem = (item: StrategyItem | string) => {
  return (
    <div className="flex items-center">
      {typeof item === 'string' ? (
        item
      ) : (
        <span className="text-lg font-semibold">
          {item.profile?.title || item.name}
        </span>
      )}
    </div>
  );
};

interface Props {
  selectedItem?: StrategyItem;
  onSelect?: (net: StrategyItem) => void;
  disabled?: boolean;
  className?: string;
}

const StrategySelector: React.FC<Props> = ({
  selectedItem,
  onSelect,
  disabled = false,
  className,
}) => {
  const strategies = useStrategiesList();

  return (
    <ComboBox
      options={strategies.data?.filter(x => x.supported_pairs.length) ?? []}
      selectedItem={
        strategies.isLoading ? 'Loading...' : selectedItem ?? 'Select Strategy'
      }
      onSelect={onSelect}
      renderItem={CoinOptionItem}
      disabled={disabled || strategies.isLoading}
      className={clsx('h-[72px]', className)}
    />
  );
};

export default StrategySelector;
