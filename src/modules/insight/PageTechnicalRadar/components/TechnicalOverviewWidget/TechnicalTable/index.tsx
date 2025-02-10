import { useMemo, type FC } from 'react';
import { type ColumnType } from 'antd/es/table';
import { Trans, useTranslation } from 'react-i18next';
import { type TechnicalRadarCoin, useTechnicalRadarCoins } from 'api';
import { AccessShield } from 'shared/AccessShield';
import Table, { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceInfo } from 'shared/CoinPriceInfo';
import { CoinLabels } from 'shared/CoinLabels';
import { ButtonSelect } from 'shared/ButtonSelect';
import { SearchInput } from 'shared/SearchInput';
import { ConfirmationBadgesInfo } from '../../ConfirmationWidget/ConfirmationBadge/ConfirmationBadgesInfo';
import { NetworkSelect } from './NetworkSelect';
import { CategoriesSelect } from './CategoriesSelect';
import { TechnicalSentiment } from './TechnicalSentiment';
import { ReactComponent as Logo } from './logo.svg';

export const TechnicalTable: FC = () => {
  const { t } = useTranslation('market-pulse');
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
  const coins = useTechnicalRadarCoins(tableState);

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
        <SearchInput
          value={tableState.query}
          onChange={query => setTableState({ query })}
          className="max-w-52 shrink-0 basis-80 mobile:order-2 mobile:max-w-full mobile:basis-full"
          placeholder={t('coin-radar:common.search_coin')}
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
          'free': true,
          'trial': 3,
          'pro': 3,
          'pro+': false,
          'pro_max': false,
        }}
      >
        <Table
          columns={columns}
          dataSource={coins.data}
          rowKey={r => JSON.stringify(r.symbol)}
          loading={coins.isRefetching && !coins.isFetched}
          tableLayout="fixed"
          {...tableProps}
        />
      </AccessShield>
    </div>
  );
};
