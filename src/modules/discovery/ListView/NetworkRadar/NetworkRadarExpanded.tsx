/* eslint-disable import/max-dependencies */
import { useTranslation } from 'react-i18next';
import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import Icon from 'shared/Icon';
import { HoverTooltip } from 'shared/HoverTooltip';
import { networkRadarGrpc } from 'api/grpc';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { NCoinList } from './NCoinList';
import { type NetworkRadarTab } from './lib';

export function NetworkRadarExpanded({ className }: { className?: string }) {
  const { t } = useTranslation('network-radar');
  const newBorn = networkRadarGrpc.useTrenchNewBornStreamLastValue({});
  const finalStretch = networkRadarGrpc.useTrenchFinalStretchStreamLastValue(
    {},
  );
  const migrated = networkRadarGrpc.useTrenchMigratedStreamLastValue({});
  const navigate = useNavigate();
  const { getUrl } = useDiscoveryRouteMeta();
  // const [, setPageState] = usePageState<{
  //   tab: NetworkRadarTab;
  // }>('network-radar', {
  //   tab: 'new_pairs',
  // });

  const onRowClick = (tab: NetworkRadarTab, slug: string) => {
    // setPageState({
    //   tab,
    // });
    navigate(
      getUrl({
        detail: 'coin',
        slug,
        view: 'both',
      }),
    );
  };

  return (
    <div className={clsx('grid grid-cols-3 gap-3', className)}>
      <h2 className="col-span-3 flex items-center justify-start gap-1 text-base">
        {t('page.title')}
        <HoverTooltip title={t('page.info')}>
          <Icon name={bxInfoCircle} className="size-5" size={20} />
        </HoverTooltip>
      </h2>

      <NCoinList
        dataSource={newBorn.data?.results ?? []}
        loading={newBorn.isLoading}
        title="New Pairs"
        onRowClick={slug => onRowClick('new_pairs', slug)}
      />
      <NCoinList
        dataSource={finalStretch.data?.results ?? []}
        loading={finalStretch.isLoading}
        title="Final Stretch"
        onRowClick={slug => onRowClick('final_stretch', slug)}
      />
      <NCoinList
        dataSource={migrated.data?.results ?? []}
        loading={migrated.isLoading}
        title="Migrated"
        onRowClick={slug => onRowClick('migrated', slug)}
      />
    </div>
  );
}
