import { clsx } from 'clsx';
import type React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ComboBox from 'shared/ComboBox';
import PairInfo from 'shared/PairInfo';
import { useSignalerPair } from 'api';
import { type MarketTypes } from 'api/types/financialProduct';

const AssetOptionItem: React.FC<{ assetName: string; market: MarketTypes }> = ({
  assetName,
  market,
}) => {
  const asset = useSignalerPair(market)(assetName);
  if (!asset?.name || !asset.base) {
    return (
      <div className="flex items-center justify-start p-2 pl-6">
        {asset?.display_name || assetName}
      </div>
    );
  }

  return (
    <PairInfo
      title={asset.display_name}
      name={asset.name}
      market={market}
      className="!justify-start"
    />
  );
};

interface Props {
  label?: string;
  loading?: boolean;
  assets?: string[];
  selectedItem?: string;
  onSelect?: (asset: string) => void;
  disabled?: boolean;
  all?: boolean;
  placeholder?: string;
  className?: string;
  comboClassName?: string;
  selectFirst?: boolean;
  market?: MarketTypes;
}

const AssetSelector: React.FC<Props> = ({
  label,
  loading,
  assets = [],
  selectedItem,
  onSelect,
  disabled = false,
  all,
  placeholder = label,
  className,
  comboClassName,
  selectFirst,
  market = 'FUTURES',
}) => {
  const { t } = useTranslation('builder');
  useEffect(() => {
    if (selectFirst && assets.length > 0 && !selectedItem && !loading) {
      onSelect?.(assets[0]);
    }
  }, [assets, loading, onSelect, selectFirst, selectedItem]);

  return (
    <div className={className}>
      {label && <label className="mb-2 ml-2 block">{label}</label>}
      <ComboBox
        options={all ? [t('all-assets'), ...assets] : assets}
        selectedItem={
          loading
            ? t('common:loading-dot-dot-dot')
            : selectedItem ?? (all ? t('all-assets') : placeholder)
        }
        onSelect={onSelect}
        renderItem={(assetName: string) => (
          <AssetOptionItem assetName={assetName} market={market} />
        )}
        disabled={disabled}
        className={clsx('!justify-start !px-2', comboClassName)}
        optionClassName="!p-0"
      />
    </div>
  );
};

export default AssetSelector;
