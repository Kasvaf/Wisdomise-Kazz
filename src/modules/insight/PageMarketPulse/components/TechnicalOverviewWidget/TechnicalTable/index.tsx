import { useMemo, type FC } from 'react';
import { type ColumnType } from 'antd/es/table';
import {
  type TechnicalRadarCoin,
  useTechnicalRadarTopCoins,
} from 'api/market-pulse';
import { AccessSheild } from 'shared/AccessSheild';
import Table from 'shared/Table';
import { Coin } from 'shared/Coin';
import { CoinMarketCap } from 'modules/insight/coinRadar/PageCoinRadar/components/CoinMarketCap';
import { CoinPriceInfo } from 'modules/insight/coinRadar/PageCoinRadar/components/CoinPriceInfo';
import { CoinLabels } from 'shared/CoinLabels';
import { CoinSecurityLabel } from 'shared/CoinSecurityLabel';
import { ReactComponent as Logo } from './logo.svg';
import { TechnicalSentiment } from './TechnicalSentiment';

export const TechnicalTable: FC = () => {
  const coins = useTechnicalRadarTopCoins();
  const columns = useMemo<Array<ColumnType<TechnicalRadarCoin>>>(
    () => [
      {
        fixed: 'left',
        title: '~Wise Rank',
        render: (_, row) => row.rank,
        width: 50,
      },
      {
        title: '~Name',
        render: (_, row) => <Coin coin={row.symbol} />,
        width: 200,
      },
      {
        title: [
          <span
            key="1"
            className="flex items-center gap-1 text-v1-content-primary"
          >
            <Logo className="inline-block size-4 grayscale" />
            {'~Technical Sentiment'}
          </span>,
        ],
        width: 310,
        render: (_, row) => <TechnicalSentiment value={row} />,
      },
      {
        title: '~MarketCap',
        width: 140,
        render: (_, row) => (
          <>{row.data && <CoinMarketCap marketData={row.data} />}</>
        ),
      },
      {
        title: '~Info',
        width: 240,
        render: (_, row) => (
          <>{row.data && <CoinPriceInfo marketData={row.data} />}</>
        ),
      },
      {
        title: '~Labels',
        className: 'min-h-16 min-w-72',
        render: (_, row) => (
          <CoinLabels
            categories={row.symbol.categories}
            labels={row.symbol_labels}
            suffix={
              <CoinSecurityLabel
                value={row.symbol_security?.data}
                coin={row.symbol}
              />
            }
          />
        ),
      },
    ],
    [],
  );
  return (
    <AccessSheild mode="table" size={3} level={1}>
      <Table
        columns={columns}
        dataSource={coins.data}
        rowKey={r => JSON.stringify(r.symbol)}
        loading={coins.isRefetching && !coins.isFetched}
        tableLayout="fixed"
      />
    </AccessSheild>
  );
};
