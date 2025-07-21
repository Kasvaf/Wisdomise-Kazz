import { useMemo } from 'react';
import { type TokenRecord, useWalletStatus, type Wallet } from 'api/wallets';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import PriceChange from 'shared/PriceChange';
import { useSymbolsInfo } from 'api/symbol';
import { Coin } from 'shared/Coin';

export default function AccountPnL({
  wallet,
  window,
}: {
  wallet: Wallet;
  window: number;
}) {
  const { data, isLoading } = useWalletStatus({
    address: wallet.address,
    window,
  });
  const coins = data
    ? Object.entries(data).map(([slug, record]) => ({ slug, record }))
    : undefined;
  const { data: symbols } = useSymbolsInfo(coins?.map(c => c.slug));

  const columns = useMemo<
    Array<TableColumn<{ slug: string; record: TokenRecord }>>
  >(
    () => [
      {
        key: 'token',
        title: 'Token',
        sticky: 'start',
        render: row => (
          <div className="text-xs">
            {(() => {
              const coin = symbols?.find(s => s.slug === row.slug);
              return coin ? <Coin coin={coin} /> : null;
            })()}
          </div>
        ),
      },
      {
        key: 'bought',
        title: 'Bought',
        className: 'text-xs text-v1-content-positive',
        render: row => `$${row.record.volume_inflow}`,
      },
      {
        key: 'sold',
        title: 'Sold',
        className: 'text-xs text-v1-content-negative',
        render: row => `$${row.record.volume_outflow}`,
      },
      {
        key: 'pnl',
        title: 'Pnl',
        render: row =>
          row.record.realized_pnl ? (
            <PriceChange
              className="text-xs"
              value={Number(row.record.realized_pnl)}
            />
          ) : null,
      },
    ],
    [symbols],
  );

  return (
    <Table
      columns={columns}
      dataSource={coins}
      chunkSize={5}
      loading={isLoading}
      rowKey={r => r.slug}
      surface={2}
      scrollable
    />
  );
}
