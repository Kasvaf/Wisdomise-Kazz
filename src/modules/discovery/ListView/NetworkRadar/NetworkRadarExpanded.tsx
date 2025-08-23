import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import QuickBuySettings from 'modules/autoTrader/BuySellTrader/QuickBuy/QuickBuySettings';
import BtnSolanaWallets from 'modules/base/wallet/BtnSolanaWallets';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { HoverTooltip } from 'shared/HoverTooltip';
import Icon from 'shared/Icon';
import { usePageState } from 'shared/usePageState';
import { useDebounce } from 'usehooks-ts';
import {
  type NetworkRadarStreamFilters,
  type NetworkRadarTab,
  useNetworkRadarStream,
} from './lib';
import { NCoinList } from './NCoinList';
import { NetworkRadarFilters } from './NetworkRadarFilters';

export function NetworkRadarExpanded({ className }: { className?: string }) {
  const { t } = useTranslation('network-radar');

  const [filters, setFilters] = usePageState<NetworkRadarStreamFilters>(
    'network-radar',
    {
      final_stretch: {},
      migrated: {},
      new_pairs: {},
    },
  );

  const lazyFilters = useDebounce(filters, 150);

  const {
    new_pairs: newPairs,
    final_stretch: finalStretch,
    migrated,
  } = useNetworkRadarStream(lazyFilters);

  const navigate = useNavigate();

  const onRowClick = (_tab: NetworkRadarTab, slug: string) => {
    navigate(`/token/${slug}`);
  };

  return (
    <div
      className={clsx(
        'grid h-full max-h-(--desktop-content-height) grid-cols-3 gap-3 overflow-hidden p-3',
        className,
      )}
    >
      <div className="col-span-3 flex items-center justify-between">
        <h2 className="flex items-center justify-start gap-1 text-base">
          {t('page.title')}
          <HoverTooltip title={t('page.info')}>
            <Icon className="size-5" name={bxInfoCircle} size={20} />
          </HoverTooltip>
        </h2>
        <BtnSolanaWallets showBalance variant="outline" />
      </div>

      <NCoinList
        dataSource={newPairs.data?.results ?? []}
        loading={newPairs.isLoading}
        onRowClick={slug => onRowClick('new_pairs', slug)}
        source="new_pairs"
        title="New Pairs"
        titleSuffix={
          <div className="flex items-center">
            <QuickBuySettings className="mr-11" source="new_pairs" />
            <NetworkRadarFilters
              initialTab="new_pairs"
              onChange={newFilters =>
                setFilters({
                  new_pairs: {},
                  final_stretch: {},
                  migrated: {},
                  ...newFilters,
                })
              }
              searchShortcut
              value={filters}
            />
          </div>
        }
      />
      <NCoinList
        dataSource={finalStretch.data?.results ?? []}
        loading={finalStretch.isLoading}
        onRowClick={slug => onRowClick('final_stretch', slug)}
        source="final_stretch"
        title="Final Stretch"
        titleSuffix={
          <div className="flex items-center">
            <QuickBuySettings className="mr-11" source="final_stretch" />
            <NetworkRadarFilters
              initialTab="final_stretch"
              onChange={newFilters =>
                setFilters({
                  new_pairs: {},
                  final_stretch: {},
                  migrated: {},
                  ...newFilters,
                })
              }
              searchShortcut
              value={filters}
            />
          </div>
        }
      />
      <NCoinList
        dataSource={migrated.data?.results ?? []}
        loading={migrated.isLoading}
        onRowClick={slug => onRowClick('migrated', slug)}
        source="migrated"
        title="Migrated"
        titleSuffix={
          <div className="flex items-center">
            <QuickBuySettings className="mr-11" source="migrated" />
            <NetworkRadarFilters
              initialTab="migrated"
              onChange={newFilters =>
                setFilters({
                  new_pairs: {},
                  final_stretch: {},
                  migrated: {},
                  ...newFilters,
                })
              }
              searchShortcut
              value={filters}
            />
          </div>
        }
      />
    </div>
  );
}
