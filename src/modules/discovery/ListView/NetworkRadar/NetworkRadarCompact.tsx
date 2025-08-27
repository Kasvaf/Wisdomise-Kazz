import type { TrenchStreamResponseResult } from 'api/proto/network_radar';
import { clsx } from 'clsx';
import QuickBuySettings from 'modules/autoTrader/BuySellTrader/QuickBuy/QuickBuySettings';
import { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageState } from 'shared/usePageState';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import {
  type NetworkRadarStreamFilters,
  type NetworkRadarTab,
  useNetworkRadarStream,
} from './lib';
import { NCoinList } from './NCoinList';
import { NetworkRadarFilters } from './NetworkRadarFilters';

export const NetworkRadarCompact: FC<{ focus?: boolean }> = () => {
  const [tab, setTab] = useState<NetworkRadarTab>('new_pairs');
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

  const onRowClick = (row: TrenchStreamResponseResult) => {
    if (row.symbol?.network && row.symbol?.base)
      return navigate(`/token/${row.symbol?.network}/${row.symbol?.base}`);
    navigate(`/token/${row.symbol?.slug}`);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2 p-3">
        <ButtonSelect
          className="w-full"
          onChange={setTab}
          options={[
            {
              label: 'New Pairs',
              value: 'new_pairs',
            },
            {
              label: 'Final Stretch',
              value: 'final_stretch',
            },
            {
              label: 'Migrated',
              value: 'migrated',
            },
          ]}
          size="xs"
          surface={1}
          value={tab}
        />
        <NetworkRadarFilters
          initialTab={tab}
          onChange={newFilters =>
            setFilters({
              new_pairs: {},
              final_stretch: {},
              migrated: {},
              ...newFilters,
            })
          }
          value={filters}
        />
      </div>
      <QuickBuySettings className="mb-3 px-3" source={tab} />
      <div className="px-3">
        <NCoinList
          className={clsx(tab !== 'new_pairs' && 'hidden')}
          dataSource={newPairs.data?.results ?? []}
          loading={newPairs.isLoading}
          mini
          onRowClick={onRowClick}
          source="new_pairs"
        />
        <NCoinList
          className={clsx(tab !== 'final_stretch' && 'hidden')}
          dataSource={finalStretch.data?.results ?? []}
          loading={finalStretch.isLoading}
          mini
          onRowClick={onRowClick}
          source="final_stretch"
        />
        <NCoinList
          className={clsx(tab !== 'migrated' && 'hidden')}
          dataSource={migrated.data?.results ?? []}
          loading={migrated.isLoading}
          mini
          onRowClick={onRowClick}
          source="migrated"
        />
      </div>
    </>
  );
};
