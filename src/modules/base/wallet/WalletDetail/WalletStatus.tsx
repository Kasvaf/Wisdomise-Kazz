import type { TokenRecord, Wallet } from 'api/wallets';
import { useWalletStatus } from 'modules/base/wallet/WalletDetail/useWalletStatus';
import { useMemo, useState } from 'react';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Token } from 'shared/v1-components/Token';

export default function WalletStatus({ wallet }: { wallet: Wallet }) {
  const [resolution, setResolution] = useState<'1d' | '7d' | '30d'>('1d');
  const { tokens, isLoading } = useWalletStatus({
    resolution,
    address: wallet.address,
  });

  const columns = useMemo<Array<TableColumn<TokenRecord>>>(
    () => [
      {
        key: 'token',
        title: 'Token',
        sticky: 'start',
        render: row => <Token address={row.token_address} autoFill />,
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
            value={row.volume_inflow}
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
            value={row.volume_outflow}
          />
        ),
      },
      {
        key: 'pnl',
        title: 'Realized Pnl',
        render: row =>
          row.realized_pnl ? (
            <span className="text-v1-content-secondary text-xs">
              <DirectionalNumber
                label="$"
                showIcon={false}
                showSign={true}
                value={row.realized_pnl}
              />{' '}
              (
              <DirectionalNumber
                format={{
                  decimalLength: 1,
                }}
                showIcon={false}
                showSign={true}
                suffix="%"
                value={
                  row.volume_inflow
                    ? (row.realized_pnl / row.volume_inflow) * 100
                    : 0
                }
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
        className="mb-3 w-max"
        onChange={newValue => setResolution(newValue)}
        options={
          [
            { value: '1d', label: '1D' },
            { value: '7d', label: '7D' },
            { value: '30d', label: '30D' },
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
        dataSource={tokens}
        loading={isLoading}
        rowKey={r => r.token_address}
        scrollable
        surface={1}
      />
    </div>
  );
}
