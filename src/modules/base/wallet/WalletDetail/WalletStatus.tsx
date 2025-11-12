import { type AssetActivity, useTraderAssetQuery } from 'api';
import type { Wallet } from 'api/wallets';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Token } from 'shared/v1-components/Token';

export default function WalletStatus({ wallet }: { wallet: Wallet }) {
  const [resolution, setResolution] = useState<number>();
  const { data: walletActivity, isLoading } = useTraderAssetQuery({
    walletAddress: wallet.address,
    fromTime: resolution
      ? dayjs().subtract(resolution, 'day').startOf('day').toISOString()
      : undefined,
  });

  const columns = useMemo<Array<TableColumn<AssetActivity>>>(
    () => [
      {
        key: 'token',
        title: 'Token',
        sticky: 'start',
        render: row => <Token autoFill slug={row.symbol_slug} />,
      },
      {
        key: 'bought',
        title: 'Bought',
        className: 'text-xs text-v1-content-positive',
        render: row => (
          <DirectionalNumber
            direction="up"
            prefix="$"
            showIcon={false}
            value={+row.total_bought_usd}
          />
        ),
      },
      {
        key: 'sold',
        title: 'Sold',
        className: 'text-xs text-v1-content-negative',
        render: row => (
          <DirectionalNumber
            direction="down"
            prefix="$"
            showIcon={false}
            value={+row.total_sold_usd}
          />
        ),
      },
      {
        key: 'pnl',
        title: 'Realized Pnl',
        render: row =>
          row.realized_pnl_usd ? (
            <span className="text-v1-content-secondary text-xs">
              <DirectionalNumber
                label="$"
                showIcon={false}
                showSign={true}
                value={+row.realized_pnl_usd}
              />{' '}
              (
              <DirectionalNumber
                format={{
                  decimalLength: 1,
                }}
                showIcon={false}
                showSign={true}
                suffix="%"
                value={+row.realized_pnl_percent}
              />
              )
            </span>
          ) : null,
      },
    ],
    [],
  );

  return (
    <div>
      <ButtonSelect
        buttonClassName="w-12"
        className="mb-3 ml-auto w-max"
        onChange={newValue => setResolution(newValue)}
        options={
          [
            { value: 1, label: '1D' },
            { value: 7, label: '7D' },
            { value: 30, label: '30D' },
            { value: undefined, label: 'ALL' },
          ] as const
        }
        size="xs"
        surface={2}
        value={resolution}
        variant="white"
      />
      <Table
        chunkSize={5}
        columns={columns}
        dataSource={walletActivity?.assets}
        loading={isLoading}
        rowKey={r => r.symbol_slug}
        scrollable
        surface={1}
      />
    </div>
  );
}
