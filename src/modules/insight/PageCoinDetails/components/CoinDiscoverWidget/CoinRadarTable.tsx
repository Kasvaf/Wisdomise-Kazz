/* eslint-disable import/max-dependencies */
import { type FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Coin } from 'shared/Coin';
import { type CoinRadarCoin, useCoinRadarCoins } from 'api';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { TableRank } from 'shared/TableRank';
import { SocialRadarSentiment } from 'modules/insight/PageSocialRadar/components/SocialRadarSentiment';
import { TechnicalRadarSentiment } from 'modules/insight/PageTechnicalRadar/components/TechnicalRadarSentiment';

export const CoinRadarTable: FC<{
  onClick: (coin: CoinRadarCoin) => void;
}> = ({ onClick }) => {
  const coins = useCoinRadarCoins({});

  const columns = useMemo<Array<TableColumn<CoinRadarCoin>>>(
    () => [
      {
        key: 'rank',
        width: 10,
        className: '[&>div]:!p-0',
        render: row => <TableRank highlighted={row._highlighted} />,
      },
      {
        key: 'coin',
        width: 64,
        render: row => (
          <Coin
            coin={row.symbol}
            imageClassName="size-7"
            className="text-sm"
            truncate={64}
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
        align: 'end',
        render: row => (
          <div className="flex shrink-0 origin-right scale-75 justify-end gap-2">
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

  const { slug } = useParams<{ slug: string }>();
  return (
    <Table
      className="max-w-full"
      columns={columns}
      dataSource={coins.data ?? []}
      rowKey={r => r.symbol.slug}
      loading={coins.isLoading}
      surface={2}
      isActive={row => row.symbol.slug === slug}
      onClick={onClick}
      scrollable={false}
    />
  );
};
