import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useWhaleTransactions, type WhaleTransaction } from 'api';
import { Coin } from 'shared/Coin';
import { ReadableNumber } from 'shared/ReadableNumber';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { AccessShield } from 'shared/AccessShield';
import { ReadableDate } from 'shared/ReadableDate';
import { type Coin as CoinType } from 'api/types/shared';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { usePageState } from 'shared/usePageState';
import { type Surface } from 'utils/useSurface';
import { Button } from 'shared/v1-components/Button';

export function WhaleTransactionsHistoryWidget({
  className,
  holderAddress,
  networkName,
  coin,
  hr,
  emptyContent,
  surface = 2,
}: {
  className?: string;
  holderAddress: string;
  networkName: string;
  coin?: CoinType;
  hr?: boolean;
  emptyContent?: ReactNode;
  surface?: Surface;
}) {
  const { t } = useTranslation('whale');

  const [tableState] = usePageState<Parameters<typeof useWhaleTransactions>[0]>(
    'transactions',
    {
      holderAddress,
      networkName,
      pageSize: 10,
      slug: coin?.slug,
    },
  );

  const transactions = useWhaleTransactions(tableState);

  const columns = useMemo<Array<TableColumn<WhaleTransaction>>>(
    () => [
      {
        title: t('whale_transaction_history.name'),
        sticky: 'start',
        width: 220,
        render: row => (
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
        render: row => <>{row.transaction_type}</>,
        width: 130,
      },
      {
        title: t('whale_transaction_history.amount'),
        width: 130,
        render: row => (
          <ReadableNumber value={row.amount} label="$" popup="never" />
        ),
      },
      {
        title: t('whale_transaction_history.price'),
        width: 130,
        render: row => (
          <ReadableNumber value={row.price} label="$" popup="never" />
        ),
      },
      {
        title: t('whale_transaction_history.worth'),
        width: 130,
        render: row => (
          <ReadableNumber value={row.worth} label="$" popup="never" />
        ),
      },
      {
        title: t('whale_transaction_history.date'),
        width: 180,
        render: row => (
          <ReadableDate
            value={row.related_at_datetime}
            format="ddd, MMM D, YYYY"
          />
        ),
      },
      {
        title: t('whale_transaction_history.profit'),
        width: 160,
        render: row => (
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
        render: row => (
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

  const allTransactions =
    transactions.data?.pages.flatMap(page => page.results) ?? [];

  if (allTransactions.length === 0)
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
            dataSource={allTransactions}
            rowKey={(row, i) => `${row.related_at_datetime} ${i}`}
            scrollable
            loading={transactions.isLoading}
            surface={surface}
            chunkSize={10}
            className="max-h-[540px]"
            footer={
              transactions.hasNextPage && (
                <Button
                  size="xs"
                  onClick={() => transactions.fetchNextPage()}
                  variant="link"
                  loading={
                    transactions.isFetchingNextPage || transactions.isLoading
                  }
                >
                  {'Load More Transactions'}
                </Button>
              )
            }
          />
        </AccessShield>
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
