import { type ReactNode, useEffect, useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { useWhaleTransactions, type WhaleTransaction } from 'api';
import { Coin } from 'shared/Coin';
import { ReadableNumber } from 'shared/ReadableNumber';
import Table, { useTableState } from 'shared/Table';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { AccessShield } from 'shared/AccessShield';
import { ReadableDate } from 'shared/ReadableDate';
import { type Coin as CoinType } from 'api/types/shared';
import Spinner from 'shared/Spinner';

export function WhaleTransactionsHistoryWidget({
  className,
  holderAddress,
  networkName,
  coin,
  hr,
  emptyContent,
}: {
  className?: string;
  holderAddress: string;
  networkName: string;
  coin?: CoinType;
  hr?: boolean;
  emptyContent?: ReactNode;
}) {
  const { t } = useTranslation('whale');

  const [tableProps, tableState, setTableState] = useTableState<
    Parameters<typeof useWhaleTransactions>[0]
  >('transactions', {
    holderAddress,
    networkName,
    page: 1,
    pageSize: 10,
    slug: coin?.slug,
  });

  const transactions = useWhaleTransactions(tableState);

  useEffect(() => {
    setTableState({
      total: transactions.data?.count ?? 0,
    });
  }, [transactions.data, setTableState]);

  const columns = useMemo<Array<ColumnType<WhaleTransaction>>>(
    () => [
      {
        title: t('whale_transaction_history.name'),
        fixed: 'left',
        render: (_, row) => (
          <Coin
            coin={{
              slug: '',
              ...row.coinstats_info,
              ...row.symbol,
            }}
            imageClassName="size-6"
            nonLink={!row.symbol?.slug}
          />
        ),
      },
      {
        title: t('whale_transaction_history.transaction_type'),
        render: (_, row) => <>{row.transaction_type}</>,
      },
      {
        title: t('whale_transaction_history.amount'),
        render: (_, row) => (
          <ReadableNumber value={row.amount} label="$" popup="never" />
        ),
      },
      {
        title: t('whale_transaction_history.price'),
        render: (_, row) => (
          <ReadableNumber value={row.price} label="$" popup="never" />
        ),
      },
      {
        title: t('whale_transaction_history.worth'),
        render: (_, row) => (
          <ReadableNumber value={row.worth} label="$" popup="never" />
        ),
      },
      {
        title: t('whale_transaction_history.date'),
        render: (_, row) => (
          <ReadableDate
            value={row.related_at_datetime}
            format="ddd, MMM D, YYYY"
          />
        ),
      },
      {
        title: t('whale_transaction_history.profit'),
        render: (_, row) => (
          <DirectionalNumber
            value={row.profit}
            showIcon={false}
            showSign
            label="$"
            popup="never"
            emptyText="-"
          />
        ),
      },
      {
        title: t('whale_transaction_history.link'),
        render: (_, row) => (
          <a
            href={row.link?.url}
            target="_blank"
            referrerPolicy="no-referrer"
            rel="noreferrer"
            className="text-v1-content-link underline hover:text-v1-content-link-hover"
          >{`${row.link?.name ?? 'Transaction'} Link`}</a>
        ),
      },
    ],
    [t],
  );

  if (transactions.data?.results.length === 0)
    return emptyContent ? <>{emptyContent}</> : null;

  return (
    <>
      <div className={className}>
        <div className="mb-4 flex items-center justify-start gap-2 whitespace-nowrap text-sm font-semibold mobile:flex-col mobile:items-start">
          {coin && (
            <>
              <Coin coin={coin} mini />
              <span>-</span>
            </>
          )}
          {t('whale_transaction_history.title')}
        </div>
        {transactions.isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Spinner className="size-10" />
          </div>
        ) : (
          <AccessShield
            mode="table"
            sizes={{
              guest: false,
              initial: false,
              free: false,
              vip: false,
            }}
          >
            <Table
              columns={columns}
              dataSource={transactions.data?.results ?? []}
              rowKey={row => JSON.stringify(row)}
              tableLayout="fixed"
              className="whitespace-nowrap"
              loading={transactions.isLoading}
              {...tableProps}
            />
          </AccessShield>
        )}
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
