/* eslint-disable import/max-dependencies */
import { type FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Coin } from 'shared/Coin';
import { useWhaleRadarCoins, type WhaleRadarCoin } from 'api';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { TableRank } from 'shared/TableRank';
import { WhaleRadarSentiment } from 'modules/insight/PageWhaleRadar/components/WhaleRadarSentiment';

export const WhaleRadarTable: FC<{
  onClick: (coin: WhaleRadarCoin) => void;
  networks: string[];
}> = ({ onClick, networks }) => {
  const coins = useWhaleRadarCoins({
    days: 7,
    networks,
  });

  const columns = useMemo<Array<MobileTableColumn<WhaleRadarCoin>>>(
    () => [
      {
        key: 'rank',
        className: 'max-w-6 min-w-2 text-start text-xs font-medium',
        render: row => <TableRank>{row.rank}</TableRank>,
      },
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
        render: row => (
          <div className="flex justify-end">
            <WhaleRadarSentiment value={row} mode="tiny" />
          </div>
        ),
      },
    ],
    [],
  );

  const { slug } = useParams<{ slug: string }>();
  return (
    <MobileTable
      className="max-w-full"
      columns={columns}
      dataSource={coins.data ?? []}
      rowKey={r => JSON.stringify(r.symbol)}
      isActive={r => r.symbol.slug === slug}
      loading={coins.isLoading}
      surface={2}
      onClick={onClick}
    />
  );
};
