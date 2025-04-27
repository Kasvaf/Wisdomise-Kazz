import { useMemo, type FC } from 'react';
import { useParams } from 'react-router-dom';
import { NCoinAge } from 'modules/insight/PageNetworkRadar/components/NCoinAge';
import { NCoinSecurity } from 'modules/insight/PageNetworkRadar/components/NCoinSecurity';
import {
  type NetworkRadarNCoin,
  useNetworkRadarNCoins,
} from 'api/insight/network';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import { Coin } from 'shared/Coin';
import { TableRank } from 'shared/TableRank';

export const NetworkRadarTable: FC<{
  onClick: (row: NetworkRadarNCoin) => void;
  networks: string[];
}> = ({ onClick, networks }) => {
  const nCoins = useNetworkRadarNCoins({ networks });

  const columns = useMemo<Array<MobileTableColumn<NetworkRadarNCoin>>>(
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
          <NCoinAge
            value={row.creation_datetime}
            imgClassName="size-3"
            className="h-[25px] text-xxs"
          />
        ),
      },
      {
        key: 'security',
        render: row => (
          <NCoinSecurity
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

  const { slug } = useParams<{ slug: string }>();
  return (
    <MobileTable
      columns={columns}
      dataSource={nCoins.data ?? []}
      rowKey={r => JSON.stringify(r.base_symbol.slug)}
      isActive={row => row.base_symbol.slug === slug}
      loading={nCoins.isLoading}
      surface={2}
      onClick={onClick}
    />
  );
};
