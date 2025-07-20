/* eslint-disable import/max-dependencies */
import { useTranslation } from 'react-i18next';
import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import Icon from 'shared/Icon';
import { HoverTooltip } from 'shared/HoverTooltip';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { usePageState } from 'shared/usePageState';
import QuickBuySettings from 'modules/autoTrader/BuySellTrader/QuickBuy/QuickBuySettings';
import { NCoinList } from './NCoinList';
import {
  type NetworkRadarStreamFilters,
  useNetworkRadarStream,
  type NetworkRadarTab,
} from './lib';
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
  const {
    new_pairs: newPairs,
    final_stretch: finalStretch,
    migrated,
  } = useNetworkRadarStream(filters);

  const navigate = useNavigate();
  const { getUrl } = useDiscoveryRouteMeta();
  // const [, setPageState] = usePageState<{
  //   tab: NetworkRadarTab;
  // }>('network-radar', {
  //   tab: 'new_pairs',
  // });

  const onRowClick = (_tab: NetworkRadarTab, slug: string) => {
    navigate(
      getUrl({
        detail: 'coin',
        slug,
        view: 'both',
      }),
    );
  };

  return (
    <div
      className={clsx(
        'grid h-full max-h-[--desktop-content-height] grid-cols-3 gap-3 overflow-hidden p-3',
        className,
      )}
    >
      <h2 className="col-span-3 flex items-center justify-start gap-1 text-base">
        {t('page.title')}
        <HoverTooltip title={t('page.info')}>
          <Icon name={bxInfoCircle} className="size-5" size={20} />
        </HoverTooltip>
      </h2>

      <NCoinList
        dataSource={newPairs}
        loading={newPairs.length === 0}
        title="New Pairs"
        titleSuffix={
          <div className="flex items-center gap-3">
            <QuickBuySettings source="new_pairs" />
            <NetworkRadarFilters
              initialTab="new_pairs"
              searchShortcut
              value={filters}
              onChange={newFilters =>
                setFilters({
                  new_pairs: {},
                  final_stretch: {},
                  migrated: {},
                  ...newFilters,
                })
              }
            />
          </div>
        }
        onRowClick={slug => onRowClick('new_pairs', slug)}
        source="new_pairs"
      />
      <NCoinList
        dataSource={finalStretch}
        loading={finalStretch.length === 0}
        title="Final Stretch"
        titleSuffix={
          <div className="flex items-center gap-3">
            <QuickBuySettings source="final_stretch" />
            <NetworkRadarFilters
              initialTab="final_stretch"
              searchShortcut
              value={filters}
              onChange={newFilters =>
                setFilters({
                  new_pairs: {},
                  final_stretch: {},
                  migrated: {},
                  ...newFilters,
                })
              }
            />
          </div>
        }
        onRowClick={slug => onRowClick('final_stretch', slug)}
        source="final_stretch"
      />
      <NCoinList
        dataSource={migrated}
        loading={migrated.length === 0}
        title="Migrated"
        titleSuffix={
          <div className="flex items-center gap-3">
            <QuickBuySettings source="migrated" />
            <NetworkRadarFilters
              initialTab="migrated"
              searchShortcut
              value={filters}
              onChange={newFilters =>
                setFilters({
                  new_pairs: {},
                  final_stretch: {},
                  migrated: {},
                  ...newFilters,
                })
              }
            />
          </div>
        }
        onRowClick={slug => onRowClick('migrated', slug)}
        source="migrated"
      />
    </div>
  );
}
