/* eslint-disable import/max-dependencies */
import { useTranslation } from 'react-i18next';
import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import Icon from 'shared/Icon';
import { HoverTooltip } from 'shared/HoverTooltip';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { usePageState } from 'shared/usePageState';
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
        }
        onRowClick={slug => onRowClick('new_pairs', slug)}
      />
      <NCoinList
        dataSource={finalStretch}
        loading={finalStretch.length === 0}
        title="Final Stretch"
        titleSuffix={
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
        }
        onRowClick={slug => onRowClick('final_stretch', slug)}
      />
      <NCoinList
        dataSource={migrated}
        loading={migrated.length === 0}
        title="Migrated"
        titleSuffix={
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
        }
        onRowClick={slug => onRowClick('migrated', slug)}
      />
    </div>
  );
}
