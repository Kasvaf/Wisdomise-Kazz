import { useMemo } from 'react';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { type CoinRadarCoin, useCoinRadarCoins } from 'api/discovery';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';

export default function AccountPnL() {
  const coins = useCoinRadarCoins({});

  const columns = useMemo<Array<TableColumn<CoinRadarCoin>>>(
    () => [
      {
        title: 'Coin',
        key: 'Coin',
        render: row => (
          <Coin
            coin={row.symbol}
            imageClassName="size-7"
            className="text-sm"
            truncate={75}
            nonLink={true}
            abbrevationSuffix={
              <DirectionalNumber
                className="ms-1"
                value={row.market_data?.price_change_percentage_24h}
                label="%"
                direction="auto"
                showIcon
                showSign={false}
                format={{
                  decimalLength: 1,
                  minifyDecimalRepeats: true,
                }}
              />
            }
          />
        ),
      },
      {
        title: 'Bought',
        key: 'bought',
        render: _row => 'yo',
      },
      {
        title: 'Sold',
        key: 'sold',
        render: _row => 'yo',
      },
      {
        title: 'PnL',
        key: 'amount',
        render: _row => 'yo',
      },
      {
        title: 'Action',
        key: 'action',
        align: 'end',
        render: _row => 'yo',
      },
    ],
    [],
  );

  return (
    <Table
      columns={columns}
      dataSource={coins.data?.slice(0, 10) ?? []}
      chunkSize={10}
      loading={coins.isLoading}
      rowKey={r => r.rank}
      surface={2}
    />
  );
}
