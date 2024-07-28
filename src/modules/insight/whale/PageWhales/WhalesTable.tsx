import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type ColumnType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { useDebounce } from 'usehooks-ts';
import { useWhales, type Whale } from 'api';
import { shortenAddress } from 'utils/shortenAddress';
import PriceChange from 'shared/PriceChange';
import { ReadableNumber } from 'shared/ReadableNumber';
import Table from 'shared/Table';
import { PageTitle } from 'shared/PageTitle';
import { NetworkSelect } from '../NetworkSelect';
import { WalletInput } from '../WalletInput';
import { Copyable } from '../Copyable';

const PAGE_SIZE = 10;

export function WhalesTable({ className }: { className?: string }) {
  const { t } = useTranslation('whale');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [isAscending, setIsAscending] = useState<boolean | undefined>(
    undefined,
  );
  const [networkAbbreviation, setNetworkAbbrevation] = useState<
    string | undefined
  >(undefined);

  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined,
  );

  const debouncedWalletAddress = useDebounce(walletAddress, 500);

  const whales = useWhales({
    page,
    pageSize: PAGE_SIZE,
    isAscending,
    sortBy,
    networkAbbreviation,
    holderAddress: debouncedWalletAddress,
  });

  const columns = useMemo<Array<ColumnType<Whale>>>(
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
          <Copyable content={row.holder_address}>
            <Link
              to={`/insight/whales/${row.holder_address}`}
              className="font-mono text-blue-400 hover:text-blue-300"
            >
              {shortenAddress(row.holder_address)}
            </Link>
          </Copyable>
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
        render: (_, row: Whale) => (
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
        render: (_, row: Whale) => (
          <ReadableNumber value={row.balance_usdt} label="usdt" />
        ),
      },
      {
        title: t('sections.top-whales.table.trades'),
        sorter: true,
        dataIndex: 'total_last_30_days_transfers',
        render: (_, row: Whale) => (
          <ReadableNumber value={row.total_last_30_days_transfers} />
        ),
      },
    ],
    [t],
  );

  return (
    <div className={clsx('flex flex-col gap-6', className)}>
      <div className="flex items-end gap-2 mobile:flex-col mobile:items-stretch">
        <div className="basis-80 mobile:basis-auto">
          <p className="mb-2 text-xs">
            {t('sections.top-whales.filters.title')}
          </p>
          <WalletInput value={walletAddress} onChange={setWalletAddress} />
        </div>
        <NetworkSelect
          valueType="abbreviation"
          value={networkAbbreviation}
          onChange={setNetworkAbbrevation}
        />
      </div>
      <PageTitle
        title={t('sections.top-whales.title')}
        description={t('sections.top-whales.subtitle')}
      />
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
          loading={whales.isFetching}
          rowKey="holder_address"
        />
      </div>
    </div>
  );
}
