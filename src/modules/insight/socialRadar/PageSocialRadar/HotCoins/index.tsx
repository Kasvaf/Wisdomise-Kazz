import { type FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bxSearch } from 'boxicons-quasar';
import { useCoinSignals } from 'api';
import Icon from 'shared/Icon';
import TextBox from 'shared/TextBox';
import { WindowHoursSelect } from './WindowHoursSelect';
import {
  type PriceChangeType,
  PriceChangeTypeSelect,
} from './PriceChangeTypeSelect';
import { HotCoinsTable } from './HotCoinsTable';

export const HotCoins: FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation('social-radar');
  const [windowHours, setWindowHours] = useState(24);
  const [priceChangeType, setPriceChangeType] =
    useState<PriceChangeType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const signals = useCoinSignals({
    meta: {
      windowHours,
    },
  });

  const filteredSignals = useMemo(() => {
    const lowercaseQuery = searchQuery.toLowerCase();
    return (signals.data ?? [])
      .filter(row => row.symbol_name.toLowerCase().includes(lowercaseQuery))
      .filter(row => {
        return (
          priceChangeType === 'all' ||
          ((row.price_change_percentage ?? 0) >= 0 &&
            priceChangeType === 'gainer') ||
          ((row.price_change_percentage ?? 0) < 0 &&
            priceChangeType === 'loser')
        );
      })
      .sort((a, b) => a.rank - b.rank);
  }, [searchQuery, signals.data, priceChangeType]);

  return (
    <div className={className}>
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mobile:flex-wrap">
          <TextBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('hot-coins-section.filters.search')}
            className="shrink-0 basis-80 mobile:basis-full"
            inputClassName="text-sm"
            suffix={<Icon name={bxSearch} />}
          />
          <div className="grow mobile:hidden" />
          <PriceChangeTypeSelect
            value={priceChangeType}
            onChange={setPriceChangeType}
          />
          <WindowHoursSelect value={windowHours} onChange={setWindowHours} />
        </div>
      </div>
      <div className="overflow-auto mobile:-mx-6 mobile:px-6">
        <HotCoinsTable
          dataSource={filteredSignals}
          loading={signals.isLoading}
        />
      </div>
    </div>
  );
};
