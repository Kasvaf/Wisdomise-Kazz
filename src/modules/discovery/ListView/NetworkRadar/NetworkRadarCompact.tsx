/* eslint-disable import/max-dependencies */
import { type FC } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { networkRadarGrpc } from 'api/grpc';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { usePageState } from 'shared/usePageState';
import { type NetworkRadarTab } from './lib';
import { NCoinList } from './NCoinList';

export const NetworkRadarCompact: FC<{ focus?: boolean }> = () => {
  const newBorn = networkRadarGrpc.useTrenchNewBornStreamLastValue({});
  const finalStretch = networkRadarGrpc.useTrenchFinalStretchStreamLastValue(
    {},
  );
  const migrated = networkRadarGrpc.useTrenchMigratedStreamLastValue({});
  const { getUrl } = useDiscoveryRouteMeta();
  const [pageState, setPageState] = usePageState<{
    tab: NetworkRadarTab;
  }>('network-radar', {
    tab: 'new_pairs',
  });
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
      <ButtonSelect
        value={pageState.tab}
        onChange={newTab => setPageState({ tab: newTab })}
        options={[
          {
            label: 'New Pairs',
            value: 'new_pairs' as NetworkRadarTab,
          },
          {
            label: 'Final Stretch',
            value: 'final_stretch' as NetworkRadarTab,
          },
          {
            label: 'Migrated',
            value: 'migrated' as NetworkRadarTab,
          },
        ]}
        size="xs"
        className="mb-3"
        surface={2}
      />
      <NCoinList
        dataSource={newBorn.data?.results ?? []}
        loading={newBorn.isLoading}
        className={clsx(pageState.tab !== 'new_pairs' && 'hidden')}
        onRowClick={onRowClick}
      />
      <NCoinList
        dataSource={finalStretch.data?.results ?? []}
        loading={finalStretch.isLoading}
        className={clsx(pageState.tab !== 'final_stretch' && 'hidden')}
        onRowClick={onRowClick}
      />
      <NCoinList
        dataSource={migrated.data?.results ?? []}
        loading={migrated.isLoading}
        className={clsx(pageState.tab !== 'migrated' && 'hidden')}
        onRowClick={onRowClick}
      />
    </>
  );
};
