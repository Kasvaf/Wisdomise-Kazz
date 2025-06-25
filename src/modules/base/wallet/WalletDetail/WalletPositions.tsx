import { useMemo } from 'react';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { type CoinRadarCoin, useCoinRadarCoins } from 'api/discovery';
import { TableRank } from 'shared/TableRank';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { SocialRadarSentiment } from 'modules/discovery/ListView/SocialRadar/SocialRadarSentiment';
import { TechnicalRadarSentiment } from 'modules/discovery/ListView/TechnicalRadar/TechnicalRadarSentiment';
import { CoinLabels } from 'shared/CoinLabels';
import { CoinMarketCap } from 'shared/CoinMarketCap';

export default function WalletPositions() {
  const coins = useCoinRadarCoins({});

  const columns = useMemo<Array<TableColumn<CoinRadarCoin>>>(
    () => [
      {
        key: 'rank',
        render: row => (
          <TableRank highlighted={row._highlighted}>{row.rank}</TableRank>
        ),
      },
      {
        key: 'coin',
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
        key: 'sentiment',
        className: 'id-tour-sentiment',
        render: row => (
          <div className="flex items-center gap-4">
            {row.social_radar_insight && (
              <SocialRadarSentiment
                value={row.social_radar_insight}
                mode="tiny"
              />
            )}
            {row.technical_radar_insight && (
              <TechnicalRadarSentiment
                value={row.technical_radar_insight}
                mode="tiny"
              />
            )}
          </div>
        ),
      },
      {
        key: 'labels',
        align: 'end',
        render: row => (
          <div className="flex flex-col items-end justify-center gap-2">
            <CoinLabels
              categories={row.symbol.categories}
              labels={row.symbol_labels}
              networks={row.networks}
              security={row.symbol_security?.data}
              coin={row.symbol}
              size="xs"
              truncate
              clickable={false}
            />
            <CoinMarketCap
              marketData={row.market_data}
              singleLine
              className="text-xxs"
            />
          </div>
        ),
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
