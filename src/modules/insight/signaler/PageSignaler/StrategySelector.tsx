import type React from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type StrategyItem } from 'api/signaler';
import ComboBox from 'shared/ComboBox';

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
  strategies?: StrategyItem[];
  selectedItem?: StrategyItem;
  onSelect?: (net: StrategyItem) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const StrategySelector: React.FC<Props> = ({
  strategies,
  selectedItem,
  onSelect,
  disabled = false,
  loading = false,
  className,
}) => {
  const { t } = useTranslation('strategy');
  return (
    <ComboBox
      options={strategies?.filter(x => x.supported_pairs.length) ?? []}
      selectedItem={
        loading ? 'Loading...' : selectedItem ?? t('select-strategy')
      }
      onSelect={onSelect}
      renderItem={CoinOptionItem}
      disabled={disabled || loading}
      className={clsx('h-[72px]', className)}
    />
  );
};

export default StrategySelector;
