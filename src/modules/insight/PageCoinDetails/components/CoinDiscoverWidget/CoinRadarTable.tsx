/* eslint-disable import/max-dependencies */
import { type FC, useMemo } from 'react';
import { Coin } from 'shared/Coin';
import {
  type CoinRadarCoin,
  MINIMUM_SOCIAL_RADAR_HIGHLIGHTED_SCORE,
  useCoinRadarCoins,
} from 'api';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { TableRank } from 'shared/TableRank';
import { SocialRadarSentiment } from 'modules/insight/PageSocialRadar/components/SocialRadarSentiment';
import { TechnicalRadarSentiment } from 'modules/insight/PageTechnicalRadar/components/TechnicalRadarSentiment';

export const CoinRadarTable: FC<{
  onClick: (coin: CoinRadarCoin) => void;
  networks: string[];
}> = ({ onClick, networks }) => {
  const coins = useCoinRadarCoins({
    networks,
  });

  const columns = useMemo<Array<MobileTableColumn<CoinRadarCoin>>>(
    () => [
      {
        key: 'rank',
        className: 'max-w-6 min-w-2 text-start text-xs font-medium',
        render: row => (
          <TableRank
            highlighted={
              (row.social_radar_insight?.wise_score ?? 0) >=
              MINIMUM_SOCIAL_RADAR_HIGHLIGHTED_SCORE
            }
          >
            {row.rank}
          </TableRank>
        ),
      },
      {
        key: 'coin',
        render: row => (
          <Coin
            coin={row.symbol}
            imageClassName="size-7"
            className="text-sm"
            truncate={60}
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
        render: row => (
          <div className="flex justify-end gap-2">
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
