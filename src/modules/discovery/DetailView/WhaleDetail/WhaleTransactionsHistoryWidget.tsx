import { useWhaleTransactions, type WhaleTransaction } from 'api/discovery';
import type { Coin as CoinType } from 'api/types/shared';
import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessShield } from 'shared/AccessShield';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableDate } from 'shared/ReadableDate';
import { ReadableNumber } from 'shared/ReadableNumber';
import { usePageState } from 'shared/usePageState';
import { Button } from 'shared/v1-components/Button';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import type { Surface } from 'utils/useSurface';

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
    'whale-transactions',
    {
      holderAddress,
      networkName,
      pageSize: 7,
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
          <ReadableNumber label="$" popup="never" value={row.amount} />
        ),
      },
      {
        title: t('whale_transaction_history.price'),
        width: 130,
        render: row => (
          <ReadableNumber label="$" popup="never" value={row.price} />
        ),
      },
      {
        title: t('whale_transaction_history.worth'),
        width: 130,
        render: row => (
          <ReadableNumber label="$" popup="never" value={row.worth} />
        ),
      },
      {
        title: t('whale_transaction_history.date'),
        width: 180,
        render: row => (
          <ReadableDate
            format="ddd, MMM D, YYYY"
            value={row.related_at_datetime}
          />
        ),
      },
      {
        title: t('whale_transaction_history.profit'),
        width: 160,
        render: row => (
          <DirectionalNumber
            emptyText="-"
            label="$"
            popup="never"
            showIcon={false}
            showSign
            value={row.profit}
          />
        ),
      },
      {
        title: t('whale_transaction_history.link'),
        render: row =>
          row.link?.url ? (
            <a
              className="text-v1-content-link underline hover:text-v1-content-link-hover"
              href={row.link?.url}
              referrerPolicy="no-referrer"
              rel="noreferrer"
              target="_blank"
            >{`${row.link?.name ?? 'Transaction'} Link`}</a>
          ) : (
            <span className="opacity-70">-</span>
          ),
      },
    ],
    [t],
  );

  const allTransactions =
    transactions.data?.pages.flatMap(page => page.results) ?? [];

  if (allTransactions.length === 0) return emptyContent ? emptyContent : null;

  return (
    <>
      <div className={className}>
        <div className="mb-4 flex mobile:flex-col mobile:items-start items-center justify-start gap-2 whitespace-nowrap font-semibold text-sm">
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
            chunkSize={7}
            columns={columns}
            dataSource={allTransactions}
            footer={
              transactions.hasNextPage && (
                <Button
                  loading={
                    transactions.isFetchingNextPage || transactions.isLoading
                  }
                  onClick={() => transactions.fetchNextPage()}
                  size="xs"
                  variant="link"
                >
                  {t('common:load-more')}
                </Button>
              )
            }
            loading={transactions.isLoading}
            rowKey={(row, i) => `${row.related_at_datetime} ${i}`}
            scrollable
            surface={surface}
          />
        </AccessShield>
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
