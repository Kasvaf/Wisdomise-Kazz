/* eslint-disable import/max-dependencies */
import { useState, type FC } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { usePageState } from 'shared/usePageState';
import QuickBuySettings from 'modules/autoTrader/BuySellTrader/QuickBuy/QuickBuySettings';
import {
  type NetworkRadarStreamFilters,
  useNetworkRadarStream,
  type NetworkRadarTab,
} from './lib';
import { NCoinList } from './NCoinList';
import { NetworkRadarFilters } from './NetworkRadarFilters';

export const NetworkRadarCompact: FC<{ focus?: boolean }> = () => {
  const { getUrl } = useDiscoveryRouteMeta();
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

  const onRowClick = (slug: string) => {
    navigate(
      getUrl({
        detail: 'coin',
        slug,
        view: 'both',
      }),
    );
  };

  return (
    <>
      <div className="flex items-center justify-between gap-2 p-3">
        <ButtonSelect
          value={tab}
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
          className="w-full"
          surface={2}
        />
        <NetworkRadarFilters
          initialTab={tab}
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
      <QuickBuySettings source={tab} className="mb-3 px-3" />
      <div className="px-3">
        <NCoinList
          dataSource={newPairs}
          loading={newPairs.length === 0}
          className={clsx(tab !== 'new_pairs' && 'hidden')}
          onRowClick={onRowClick}
          mini
          source="new_pairs"
        />
        <NCoinList
          dataSource={finalStretch}
          loading={finalStretch.length === 0}
          className={clsx(tab !== 'final_stretch' && 'hidden')}
          onRowClick={onRowClick}
          mini
          source="final_stretch"
        />
        <NCoinList
          dataSource={migrated}
          loading={migrated.length === 0}
          className={clsx(tab !== 'migrated' && 'hidden')}
          onRowClick={onRowClick}
          hideBCurve
          mini
          source="migrated"
        />
      </div>
    </>
  );
};
