import { Pagination } from 'antd';
import {
  initialQuoteDeposit,
  type Position,
  useTraderPositionsQuery,
} from 'api';
import { useSymbolsInfo } from 'api/symbol';
import type { Wallet } from 'api/wallets';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { PositionActions } from 'modules/autoTrader/Positions/PositionsList/PositionDetail';
import PositionStatus from 'modules/autoTrader/Positions/PositionsList/PositionStatus';
import { useMemo, useState } from 'react';
import { Coin } from 'shared/Coin';
import { HoverTooltip } from 'shared/HoverTooltip';
import PriceChange from 'shared/PriceChange';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { roundSensible } from 'utils/numbers';

const PAGE_SIZE = 30;
export default function WalletPositions({ wallet }: { wallet: Wallet }) {
  const [page, setPage] = useState<string>('1');
  const positions = useTraderPositionsQuery({
    address: wallet.address,
    pageSize: PAGE_SIZE,
    page: +page,
  });

  const isOpen = (position: Position) => {
    return ['OPENING', 'OPEN', 'CLOSING'].includes(position.status);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  const columns = useMemo<Array<TableColumn<Position>>>(
    () => [
      {
        key: 'id',
        title: 'ID',
        render: row => <span className="text-white/30 text-xs">#{row.id}</span>,
      },
      {
        key: 'pair',
        title: 'Pair',
        sticky: 'start',
        render: row => (
          <div className="flex items-center gap-2 text-xs">
            <PairAssets base={row.base_slug} quote={row.quote_slug} />
            {!!row.mode && row.mode !== 'buy_and_sell' && (
              <span className="rounded-full bg-white/10 px-2">Swap</span>
            )}
          </div>
        ),
      },
      {
        key: 'status',
        title: 'Status',
        render: row => (
          <div className="w-20 text-xs">
            <PositionStatus mini position={row} />
          </div>
        ),
      },
      {
        key: 'openedAt',
        title: 'Opened At',
        render: row =>
          row.entry_time ? (
            <HoverTooltip
              title={dayjs(row.entry_time).format('YYYY-MM-DD HH:mm:ss')}
            >
              <span className="text-xs">{dayjs(row.entry_time).fromNow()}</span>
            </HoverTooltip>
          ) : null,
      },
      {
        key: 'deposit',
        title: 'Deposit',
        render: row =>
          initialQuoteDeposit(row) ? (
            <span className="flex items-center text-xs">
              {initialQuoteDeposit(row)} {row.quote_name}
            </span>
          ) : null,
      },
      {
        key: 'pnl',
        title: 'Pnl',
        render: row =>
          row.pnl != null && row.mode === 'buy_and_sell' ? (
            <PriceChange className="text-xs" value={Number(row.pnl)} />
          ) : null,
      },
      {
        key: 'current',
        title: 'Current Value',
        render: row =>
          isOpen(row) && Number(row.current_total_usd_equity) > 0 ? (
            <span className="text-xs">
              ${roundSensible(row.current_total_usd_equity)}
            </span>
          ) : null,
      },
      {
        key: 'actions',
        title: 'Actions',
        render: row => <PositionActions position={row} />,
      },
    ],
    [],
  );

  return (
    <Table
      chunkSize={5}
      columns={columns}
      dataSource={positions?.data?.positions ?? []}
      footer={
        <Pagination
          current={+page}
          hideOnSinglePage
          onChange={x => setPage(String(x))}
          pageSize={PAGE_SIZE}
          responsive
          total={positions?.data?.count}
        />
      }
      loading={positions.isLoading}
      rowKey={r => r.key}
      scrollable
      surface={1}
    />
  );
}

function PairAssets({ base, quote }: { base: string; quote: string }) {
  const { data: coins } = useSymbolsInfo([base, quote]);

  return (
    <div className="flex items-center">
      {coins?.map(
        (coin, index) =>
          coin && (
            <Coin
              className={clsx(
                'relative z-10',
                index !== 0 && '!z-0 -ml-6 absolute',
              )}
              coin={coin}
              key={coin.slug}
              nonLink={index !== 0}
              noText
            />
          ),
      )}
      <span className="ml-2">
        {coins?.map(c => c?.abbreviation)?.join('/')}
      </span>
    </div>
  );
}
