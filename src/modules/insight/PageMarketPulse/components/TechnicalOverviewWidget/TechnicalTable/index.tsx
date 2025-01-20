import { useMemo, type FC } from 'react';
import { type ColumnType } from 'antd/es/table';
import { Trans, useTranslation } from 'react-i18next';
import {
  type TechnicalRadarCoin,
  useTechnicalRadarTopCoins,
} from 'api/market-pulse';
import { AccessShield } from 'shared/AccessShield';
import Table, { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import { CoinMarketCap } from 'modules/insight/coinRadar/PageCoinRadar/components/CoinMarketCap';
import { CoinPriceInfo } from 'modules/insight/coinRadar/PageCoinRadar/components/CoinPriceInfo';
import { CoinLabels } from 'shared/CoinLabels';
import { ButtonSelect } from 'shared/ButtonSelect';
import { ConfirmationBadgesInfo } from '../../ConfirmationWidget/ConfirmationBadge/ConfirmationBadgesInfo';
import { CoinSearchInput } from './CoinSearchInput';
import { NetworkSelect } from './NetworkSelect';
import { CategoriesSelect } from './CategoriesSelect';
import { TechnicalSentiment } from './TechnicalSentiment';
// eslint-disable-next-line import/max-dependencies
import { ReactComponent as Logo } from './logo.svg';

export const TechnicalTable: FC = () => {
  const { t } = useTranslation('market-pulse');
  const coins = useTechnicalRadarTopCoins();
  const [tableProps, tableState, setTableState] = useTableState(
    'overviewTable',
    {
      page: 1,
      pageSize: 10,
      sortBy: 'rank',
      query: '',
      network: '',
      category: '',
    },
  );
  const filteredCoins = useMemo(() => {
    const lowercaseQuery = tableState.query.toLowerCase();
    return (coins.data ?? [])
      .filter(
        row =>
          !lowercaseQuery ||
          `${row.symbol.name ?? ''}${row.symbol.abbreviation ?? ''}${
            row.symbol.slug ?? ''
          }`
            ?.toLowerCase()
            .includes(lowercaseQuery),
      )
      .filter(
        row =>
          !tableState.network ||
          (row.networks_slug ?? []).includes(tableState.network),
      )
      .filter(
        row =>
          !tableState.category ||
          (row.symbol.categories ?? [])
            .map(r => r.slug)
            .includes(tableState.category),
      )
      .sort((a, b) => {
        if (tableState.sortBy === 'price_change') {
          return (
            (b.data?.price_change_percentage_24h ?? 0) -
            (a.data?.price_change_percentage_24h ?? 0)
          );
        }
        if (tableState.sortBy === 'market_cap') {
          return (b.data?.market_cap ?? 0) - (a.data?.market_cap ?? 0);
        }
        return a.rank - b.rank;
      });
  }, [tableState, coins.data]);

  const columns = useMemo<Array<ColumnType<TechnicalRadarCoin>>>(
    () => [
      {
        fixed: 'left',
        title: t('table.rank'),
        render: (_, row) => row.rank,
        width: 50,
      },
      {
        title: t('table.name'),
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
            {t('table.technical_sentiment.title')}
          </span>,
          <ConfirmationBadgesInfo key="2" />,
        ],
        width: 310,
        render: (_, row) => <TechnicalSentiment value={row} />,
      },
      {
        title: [t('table.market_cap.title'), t('table.market_cap.info')],
        width: 140,
        render: (_, row) => (
          <>{row.data && <CoinMarketCap marketData={row.data} />}</>
        ),
      },
      {
        title: [
          t('table.price_info.title'),
          <div
            key="2"
            className="[&_b]:font-medium [&_p]:text-xs [&_p]:text-v1-content-secondary"
          >
            <Trans i18nKey="table.price_info.info" ns="market-pulse" />
          </div>,
        ],
        width: 240,
        render: (_, row) => (
          <>{row.data && <CoinPriceInfo marketData={row.data} />}</>
        ),
      },
      {
        title: t('table.labels'),
        className: 'min-h-16 min-w-72',
        render: (_, row) => (
          <CoinLabels
            categories={row.symbol.categories}
            labels={row.symbol_labels}
            networks={row.networks}
            security={row.symbol_security?.data}
            coin={row.symbol}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <div>
      <div className="mb-6 flex w-full grow grid-cols-1 flex-wrap justify-start gap-4 mobile:!grid">
        <CoinSearchInput
          value={tableState.query}
          onChange={query => setTableState({ query })}
          className="max-w-52 shrink-0 basis-80 mobile:order-2 mobile:max-w-full mobile:basis-full"
        />
        <NetworkSelect
          value={tableState.network || undefined}
          onChange={network => setTableState({ network })}
          className="mobile:order-3"
        />
        <CategoriesSelect
          value={tableState.category || undefined}
          onChange={category => setTableState({ category })}
          className="mobile:order-4"
        />
        <div className="flex flex-wrap items-center gap-2 mobile:order-5">
          <span className="text-xs mobile:w-full mobile:grow">
            {t('table.sort')}:
          </span>
          <ButtonSelect
            options={[
              {
                label: t('table.sorts.rank'),
                value: 'rank',
              },
              {
                label: t('table.sorts.price_change'),
                value: 'price_change',
              },
              {
                label: t('table.sorts.market_cap'),
                value: 'market_cap',
              },
            ]}
            value={tableState.sortBy}
            onChange={sortBy => setTableState({ sortBy })}
          />
        </div>

        <div className="grow mobile:hidden" />
      </div>

      <AccessShield
        mode="table"
        sizes={{
          'guest': true,
          'trial': 3,
          'free': true,
          'pro': false,
          'pro+': false,
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredCoins}
          rowKey={r => JSON.stringify(r.symbol)}
          loading={coins.isRefetching && !coins.isFetched}
          tableLayout="fixed"
          {...tableProps}
        />
      </AccessShield>
    </div>
  );
};
