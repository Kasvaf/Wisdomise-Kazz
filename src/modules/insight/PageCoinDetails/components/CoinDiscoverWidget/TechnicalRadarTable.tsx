/* eslint-disable import/max-dependencies */
import { type FC, useMemo } from 'react';
import { Coin } from 'shared/Coin';
import { type TechnicalRadarCoin, useTechnicalRadarCoins } from 'api';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { TableRank } from 'shared/TableRank';
import { TechnicalRadarSentiment } from 'modules/insight/PageTechnicalRadar/components/TechnicalRadarSentiment';

export const TechnicalRadarTable: FC<{
  onClick?: (coin: TechnicalRadarCoin) => void;
}> = ({ onClick }) => {
  const coins = useTechnicalRadarCoins({});

  const columns = useMemo<Array<MobileTableColumn<TechnicalRadarCoin>>>(
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
            <TechnicalRadarSentiment value={row} mode="tiny" />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <MobileTable
      className="max-w-full"
      columns={columns}
      dataSource={coins.data ?? []}
      rowKey={r => JSON.stringify(r.symbol)}
      loading={coins.isLoading}
      surface={2}
      onClick={onClick}
    />
  );
};
