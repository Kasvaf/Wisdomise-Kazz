import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type ColumnType } from 'antd/es/table';
import { clsx } from 'clsx';
import { useDebounce } from 'usehooks-ts';
import { useWhales, type WhaleShort } from 'api';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import Table from 'shared/Table';
import { PageTitle } from 'shared/PageTitle';
import { ButtonSelect } from 'shared/ButtonSelect';
import { WalletAddress } from '../WalletAddress';

export function WhalesTable({
  className,
  networkAbbreviation,
  walletAddress,
}: {
  className?: string;
  networkAbbreviation?: string;
  walletAddress?: string;
}) {
  const { t } = useTranslation('whale');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [isAscending, setIsAscending] = useState<boolean | undefined>(
    undefined,
  );

  const debouncedWalletAddress = useDebounce(walletAddress, 500);

  const whales = useWhales({
    page,
    pageSize: 5,
    isAscending,
    sortBy,
    networkAbbreviation,
    holderAddress: debouncedWalletAddress,
  });

  const columns = useMemo<Array<ColumnType<WhaleShort>>>(
    () => [
      {
        title: t('sections.top-whales.table.rank'),
        sorter: true,
        dataIndex: 'rank',
      },
      {
        title: t('sections.top-whales.table.wallet-address'),
        dataIndex: 'holder_address',
        render: (_, row) => (
          <WalletAddress
            address={row.holder_address}
            network={row.network_abbreviation}
            mode="link"
          />
        ),
      },
      {
        title: t('sections.top-whales.table.network'),
        dataIndex: 'network_abbreviation',
        render: (_, row) => (
          <span className="inline-flex items-center gap-1">
            <img
              src={row.network_icon_url}
              className="size-5 rounded-full bg-white"
              alt={row.network_name}
            />
            {row.network_name}
          </span>
        ),
      },
      {
        title: t('sections.top-whales.table.pnl_percent'),
        sorter: true,
        dataIndex: 'last_30_days_trading_pnl_percentage',
        render: (_, row) => (
          <PriceChange
            className="inline-flex"
            value={row.last_30_days_trading_pnl_percentage}
          />
        ),
      },
      {
        title: t('sections.top-whales.table.total_worth'),
        sorter: true,
        dataIndex: 'balance_usdt',
        render: (_, row) => (
          <ReadableNumber value={row.balance_usdt} label="usdt" />
        ),
      },
      {
        title: t('sections.top-whales.table.trades'),
        sorter: true,
        dataIndex: 'total_last_30_days_transfers',
        render: (_, row) => (
          <ReadableNumber value={row.total_last_30_days_transfers} />
        ),
      },
    ],
    [t],
  );

  return (
    <div className={clsx('flex flex-col gap-6', className)}>
      <div className="flex flex-nowrap items-center justify-between gap-4">
        <PageTitle
          title={t('sections.top-whales.title')}
          description={t('sections.top-whales.subtitle')}
        />
        <ButtonSelect
          value={30}
          className="shrink-0"
          options={[
            {
              label: t('sections.top-whales.filters.1d'),
              value: 1,
              disabled: true,
            },
            {
              label: t('sections.top-whales.filters.7d'),
              value: 7,
              disabled: true,
            },
            {
              label: t('sections.top-whales.filters.30d'),
              value: 30,
            },
          ]}
        />
      </div>
      <div className="-mx-6 overflow-auto px-6">
        <Table
          columns={columns}
          dataSource={whales.data?.results ?? []}
          pagination={{
            total: whales.data?.count ?? 1,
          }}
          onChange={(pagination, _, sorter) => {
            setPage(pagination.current ?? 1);
            if (!Array.isArray(sorter)) {
              setSortBy(
                typeof sorter.field === 'string' && sorter.order
                  ? sorter.field
                  : undefined,
              );
              setIsAscending(
                sorter.order === 'ascend'
                  ? true
                  : sorter.order === 'descend'
                  ? false
                  : undefined,
              );
            }
          }}
          loading={whales.isFetching && whales.isPreviousData}
          rowKey="holder_address"
        />
      </div>
    </div>
  );
}
