/* eslint-disable import/max-dependencies */
import { type FC, useMemo } from 'react';
import { Coin } from 'shared/Coin';
import {
  MINIMUM_SOCIAL_RADAR_HIGHLIGHTED_SCORE,
  type SocialRadarCoin,
  useSocialRadarCoins,
} from 'api';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { TableRank } from 'shared/TableRank';
import { SocialRadarSentiment } from 'modules/insight/PageSocialRadar/components/SocialRadarSentiment';

export const SocialRadarTable: FC<{
  onClick: (coin: SocialRadarCoin) => void;
  networks: string[];
}> = ({ onClick, networks }) => {
  const coins = useSocialRadarCoins({
    windowHours: 24,
    networks,
  });

  const columns = useMemo<Array<MobileTableColumn<SocialRadarCoin>>>(
    () => [
      {
        key: 'rank',
        className: 'max-w-6 min-w-2 text-start text-xs font-medium',
        render: row => (
          <TableRank
            highlighted={
              (row.wise_score ?? 0) >= MINIMUM_SOCIAL_RADAR_HIGHLIGHTED_SCORE
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
            truncate={70}
            nonLink={true}
            abbrevationSuffix={
              <DirectionalNumber
                className="ms-1"
                value={row.symbol_market_data?.price_change_percentage_24h}
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
            <SocialRadarSentiment value={row} mode="tiny" />
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
