/* eslint-disable import/max-dependencies */
import { type FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Coin } from 'shared/Coin';
import { useWhaleRadarCoins, type WhaleRadarCoin } from 'api';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { WhaleRadarSentiment } from 'modules/insight/PageWhaleRadar/components/WhaleRadarSentiment';

export const WhaleRadarTable: FC<{
  onClick: (coin: WhaleRadarCoin) => void;
}> = ({ onClick }) => {
  const coins = useWhaleRadarCoins({
    days: 7,
  });

  const columns = useMemo<Array<TableColumn<WhaleRadarCoin>>>(
    () => [
      {
        key: 'coin',
        render: row => (
          <Coin
            coin={row.symbol}
            imageClassName="size-7"
            className="text-sm"
            truncate={70}
            nonLink={true}
            abbrevationSuffix={
              <DirectionalNumber
                className="ms-1"
                value={row.data?.price_change_percentage_24h}
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
        key: 'sentiment',
        align: 'end',
        render: row => <WhaleRadarSentiment value={row} mode="tiny" />,
      },
    ],
    [],
  );

  const { slug } = useParams<{ slug: string }>();
  return (
    <Table
      className="max-w-full"
      columns={columns}
      dataSource={coins.data ?? []}
      rowKey={r => JSON.stringify(r.symbol)}
      isActive={r => r.symbol.slug === slug}
      loading={coins.isLoading}
      surface={2}
      onClick={onClick}
      scrollable={false}
    />
  );
};
