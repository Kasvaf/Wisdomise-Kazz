/* eslint-disable import/max-dependencies */
import { useMemo } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type TableColumnType } from 'antd';
import { OverviewWidget } from 'shared/OverviewWidget';
import Table, { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';

import { NetworkSelect } from 'shared/NetworkSelect';
import {
  type NetworkRadarPool,
  useNetworkRadarPools,
} from 'api/insight/network';
import { ReadableNumber } from 'shared/ReadableNumber';
import { PoolAge } from '../PoolAge';
import { PoolTradingVolume } from '../PoolTradingVolume';
import { PoolBuySell } from '../PoolBuySell';
import { PoolLiquidity } from '../PoolLiquidity';
import { PoolSecurity } from '../PoolSecurity';
import { PoolRecentCandles } from '../PoolRecentCandles';

export function NetworkRadarDesktop({ className }: { className?: string }) {
  const { t } = useTranslation('network-radar');
  const [tableProps, tableState, setTableState] = useTableState<
    Required<Parameters<typeof useNetworkRadarPools>[0]>
  >('', {
    page: 1,
    pageSize: 20,
    networks: ['solana'],
  });

  const pools = useNetworkRadarPools(tableState);

  const columns = useMemo<Array<TableColumnType<NetworkRadarPool>>>(
    () => [
      {
        title: '#',
        render: (_, __, index) => index + 1,
        fixed: 'left',
        className: 'w-14 max-w-14',
      },
      {
        title: t('common.name'),
        fixed: 'left',
        className: 'w-44 max-w-44',
        render: (_, row) => <Coin coin={row.base_symbol} nonLink={true} />,
      },
      {
        title: t('common.created'),
        className: 'w-20 max-w-20',
        render: (_, row) => (
          <PoolAge
            value={row.creation_datetime}
            imgClassName="size-4 opacity-75"
            className="text-xs"
            inline
          />
        ),
      },
      {
        title: t('common.liquidity'),
        className: 'w-44 max-w-44',
        render: (_, row) => (
          <PoolLiquidity
            value={row}
            className="text-xs"
            imgClassName="size-5"
            type="update"
          />
        ),
      },
      {
        title: t('common.initial_liquidity'),
        className: 'w-44 max-w-44',
        render: (_, row) => (
          <PoolLiquidity value={row} className="text-xs" type="initial" />
        ),
      },
      {
        title: t('common.marketcap'),
        className: 'w-28 max-w-28',
        render: (_, row) => (
          <ReadableNumber
            value={row.update.base_market_data.market_cap}
            className="text-xs"
            label="$"
            format={{
              decimalLength: 1,
            }}
          />
        ),
      },
      {
        title: [t('common.txns.title'), t('common.txns.info')],
        className: 'w-28 max-w-28',
        render: (_, row) => (
          <PoolBuySell value={row} imgClassName="size-3" className="text-xs" />
        ),
      },
      {
        title: t('common.volume'),
        className: 'w-32 max-w-32',
        render: (_, row) => (
          <PoolTradingVolume
            value={row}
            imgClassName="size-4"
            className="text-xs"
          />
        ),
      },
      {
        title: t('common.validation_insights'),
        render: (_, row) => (
          <PoolSecurity
            value={row}
            className="shrink-0 text-xxs"
            imgClassName="size-4"
            type="row"
          />
        ),
      },
      {
        title: '',
        render: (_, row) => (
          <PoolRecentCandles
            value={row}
            height={50}
            width={65}
            renderer="canvas"
          />
        ),
      },
    ],
    [t],
  );

  return (
    <OverviewWidget
      className={clsx(
        'min-h-[670px] shrink-0 xl:min-h-[631px] 2xl:min-h-[640px]',
        className,
      )}
      title={t('page.title')}
      info={t('page.info')}
      loading={pools.isInitialLoading}
      empty={(pools.data ?? [])?.length === 0}
      headerActions={
        <>
          <NetworkSelect
            value={tableState.networks?.[0]}
            allowClear
            multiple={false}
            onChange={newNetwork =>
              setTableState({ networks: newNetwork ? [newNetwork] : [] })
            }
            size="sm"
            valueType="slug"
            surface={3}
          />
        </>
      }
    >
      <AccessShield
        mode="table"
        sizes={{
          'guest': true,
          'initial': 3,
          'free': 3,
          'pro': false,
          'pro+': false,
          'pro_max': false,
        }}
      >
        <Table
          columns={columns}
          dataSource={pools.data}
          rowKey={r => JSON.stringify(r.base_symbol)}
          loading={pools.isLoading && !pools.data}
          tableLayout="fixed"
          {...tableProps}
        />
      </AccessShield>
    </OverviewWidget>
  );
}
