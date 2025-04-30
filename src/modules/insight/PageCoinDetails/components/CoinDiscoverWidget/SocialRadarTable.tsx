/* eslint-disable import/max-dependencies */
import { type FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Coin } from 'shared/Coin';
import { type SocialRadarCoin, useSocialRadarCoins } from 'api';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { TableRank } from 'shared/TableRank';
import { SocialRadarSentiment } from 'modules/insight/PageSocialRadar/components/SocialRadarSentiment';
import { AccessShield } from 'shared/AccessShield';

export const SocialRadarTable: FC<{
  onClick: (coin: SocialRadarCoin) => void;
  networks: string[];
}> = ({ onClick, networks }) => {
  const coins = useSocialRadarCoins({
    windowHours: 24,
    networks,
  });

  const columns = useMemo<Array<TableColumn<SocialRadarCoin>>>(
    () => [
      {
        key: 'rank',
        width: 10,
        className: '[&>div]:!p-0',
        render: row => <TableRank highlighted={row._highlighted} />,
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
        align: 'end',
        render: row => <SocialRadarSentiment value={row} mode="tiny" />,
      },
    ],
    [],
  );

  const { slug } = useParams<{ slug: string }>();
  return (
    <AccessShield
      mode="children"
      sizes={{
        guest: true,
        initial: true,
        free: true,
        vip: false,
      }}
    >
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
    </AccessShield>
  );
};
