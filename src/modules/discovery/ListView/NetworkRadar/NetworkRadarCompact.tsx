import { clsx } from 'clsx';
import QuickBuySettings from 'modules/autoTrader/BuySellTrader/QuickBuy/QuickBuySettings';
import { type FC, useState } from 'react';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { type NetworkRadarTab, useNetworkRadarStream } from './lib';
import { NCoinList } from './NCoinList';
import { NetworkRadarFilters } from './NetworkRadarFilters';

export const NetworkRadarCompact: FC<{ focus?: boolean }> = () => {
  const [tab, setTab] = useState<NetworkRadarTab>('new_pairs');

  const {
    new_pairs: newPairs,
    final_stretch: finalStretch,
    migrated,
  } = useNetworkRadarStream();

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
        <NetworkRadarFilters initialTab={tab} />
      </div>
      <QuickBuySettings className="mb-3 px-3" source={tab} surface={1} />
      <div className="px-3">
        <NCoinList
          className={clsx(tab !== 'new_pairs' && 'hidden')}
          dataSource={newPairs.data?.results ?? []}
          loading={newPairs.isLoading}
          mini
          source="new_pairs"
        />
        <NCoinList
          className={clsx(tab !== 'final_stretch' && 'hidden')}
          dataSource={finalStretch.data?.results ?? []}
          loading={finalStretch.isLoading}
          mini
          source="final_stretch"
        />
        <NCoinList
          className={clsx(tab !== 'migrated' && 'hidden')}
          dataSource={migrated.data?.results ?? []}
          loading={migrated.isLoading}
          mini
          source="migrated"
        />
      </div>
    </>
  );
};
