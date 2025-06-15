/* eslint-disable import/max-dependencies */
import { useTranslation } from 'react-i18next';
import { bxInfoCircle } from 'boxicons-quasar';
import { clsx } from 'clsx';
import Icon from 'shared/Icon';
import { HoverTooltip } from 'shared/HoverTooltip';
import { networkRadarGrpc } from 'api/grpc';
import { NCoinList } from './NCoinList';

export function NetworkRadarExpanded({ className }: { className?: string }) {
  const { t } = useTranslation('network-radar');

  // const [pageState, setPageState] = usePageState<
  //   Parameters<typeof useNetworkRadarNCoins>[0]
  // >('network-radar', {});

  const newBorn = networkRadarGrpc.useTrenchNewBornStreamLastValue({});

  const finalStretch = networkRadarGrpc.useTrenchFinalStretchStreamLastValue(
    {},
  );
  const migrated = networkRadarGrpc.useTrenchMigratedStreamLastValue({});

  return (
    <div className={clsx('grid grid-cols-3 gap-3', className)}>
      <h2 className="col-span-3 flex items-start justify-start gap-1 text-base">
        {t('page.title')}{' '}
        <HoverTooltip title={t('page.info')}>
          <Icon name={bxInfoCircle} className="size-5" />
        </HoverTooltip>
      </h2>

      <NCoinList
        dataSource={newBorn.data?.results ?? []}
        loading={newBorn.isLoading}
        title="New Pairs"
        className=""
      />
      <NCoinList
        dataSource={finalStretch.data?.results ?? []}
        loading={finalStretch.isLoading}
        title="Final Stretch"
        className=""
      />
      <NCoinList
        dataSource={migrated.data?.results ?? []}
        loading={migrated.isLoading}
        title="Migrated"
        className=""
      />
    </div>
  );
}
