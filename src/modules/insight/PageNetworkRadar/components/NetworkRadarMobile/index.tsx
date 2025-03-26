/* eslint-disable import/max-dependencies */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MobileSearchBar } from 'shared/MobileSearchBar';
import { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import {
  type NetworkRadarPool,
  useNetworkRadarPools,
} from 'api/insight/network';
import { NetworkSelect } from 'shared/NetworkSelect';
import { PoolAge } from '../PoolAge';
import { PoolBuySell } from '../PoolBuySell';
import { PoolTradingVolume } from '../PoolTradingVolume';
import { PoolLiquidity } from '../PoolLiquidity';
import { PoolSecurity } from '../PoolSecurity';
import { PoolPreDetailModal } from '../PoolPreDetailModal';

export const NetworkRadarMobile = () => {
  const { t } = useTranslation('network-radar');
  const [, tableState, setTableState] = useTableState<
    Required<Parameters<typeof useNetworkRadarPools>[0]>
  >('', {
    page: 1,
    pageSize: 10,
    networks: ['solana'],
  });

  const [selectedRow, setSelectedRow] = useState<null | NetworkRadarPool>(null);
  const [modal, setModal] = useState(false);

  const pools = useNetworkRadarPools(tableState);

  const columns = useMemo<Array<MobileTableColumn<NetworkRadarPool>>>(
    () => [
      {
        key: 'rank',
        className: 'max-w-7 min-w-2 text-start text-xs font-medium',
        render: row => row._rank,
      },
      {
        key: 'coin',
        render: row => (
          <Coin
            coin={row.base_symbol}
            imageClassName="size-7"
            className="text-xs"
            truncate={55}
            nonLink={true}
          />
        ),
      },
      {
        key: 'age',
        className: 'max-w-12 min-w-8',
        render: row => (
          <PoolAge
            value={row.creation_datetime}
            imgClassName="size-3"
            className="h-[25px] text-xxs"
          />
        ),
      },
      {
        key: 'market_data',
        className: 'max-w-20',
        render: row => (
          <div className="flex h-[25px] flex-col justify-between">
            <PoolTradingVolume
              value={row}
              imgClassName="size-3"
              className="text-xxs"
            />
            <PoolBuySell
              value={row}
              imgClassName="size-3"
              className="text-[8px]"
            />
          </div>
        ),
      },
      {
        key: 'liquidity',
        className: 'max-w-22',
        render: row => (
          <PoolLiquidity
            value={row}
            className="text-xxs"
            imgClassName="size-6"
            type="update_with_icon"
          />
        ),
      },
      {
        key: 'security',
        render: row => (
          <PoolSecurity
            value={row}
            className="shrink-0 text-xxs"
            imgClassName="size-3"
            type="grid"
          />
        ),
      },
    ],
    [],
  );

  return (
    <>
      <MobileSearchBar className="mb-4" />
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-sm">{t('page.title')}</h1>
        </div>
        <NetworkSelect
          value={tableState.networks?.[0]}
          allowClear
          multiple={false}
          onChange={newNetwork =>
            setTableState({ networks: newNetwork ? [newNetwork] : [] })
          }
          size="sm"
          valueType="slug"
          surface={2}
        />
      </div>
      <AccessShield
        mode="mobile_table"
        sizes={{
          'guest': true,
          'initial': 3,
          'free': 3,
          'pro': false,
          'pro+': false,
          'pro_max': false,
        }}
      >
        <MobileTable
          columns={columns}
          dataSource={pools.data ?? []}
          rowKey={r => JSON.stringify(r.base_symbol.slug)}
          loading={(pools.data?.length ?? 0) === 0 && pools.isLoading}
          surface={2}
          onClick={r => {
            setSelectedRow(r);
            setModal(true);
          }}
        />
      </AccessShield>
      <PoolPreDetailModal
        value={selectedRow}
        open={modal}
        onClose={() => setModal(false)}
      />
    </>
  );
};
