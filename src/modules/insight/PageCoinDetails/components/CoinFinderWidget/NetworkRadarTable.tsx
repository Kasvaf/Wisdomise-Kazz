import { useMemo, type FC } from 'react';
import {
  type NetworkRadarPool,
  useNetworkRadarPools,
} from 'api/insight/network';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import { Coin } from 'shared/Coin';
import { PoolAge } from 'modules/insight/PageNetworkRadar/components/PoolAge';
import { PoolSecurity } from 'modules/insight/PageNetworkRadar/components/PoolSecurity';
import { TableRank } from 'shared/TableRank';

export const NetworkRadarTable: FC<{
  onClick?: (row: NetworkRadarPool) => void;
}> = ({ onClick }) => {
  const pools = useNetworkRadarPools({});

  const columns = useMemo<Array<MobileTableColumn<NetworkRadarPool>>>(
    () => [
      {
        key: 'rank',
        className: 'max-w-10 min-w-2 text-start text-xs font-medium',
        render: row => <TableRank>{row._rank}</TableRank>,
      },
      {
        key: 'coin',
        render: row => (
          <Coin
            coin={row.base_symbol}
            imageClassName="size-7"
            className="text-xs"
            truncate={50}
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
    <MobileTable
      columns={columns}
      dataSource={pools.data ?? []}
      rowKey={r => JSON.stringify(r.base_symbol.slug)}
      loading={pools.isLoading}
      surface={2}
      onClick={onClick}
    />
  );
};
