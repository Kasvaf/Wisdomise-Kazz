import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type ColumnType } from 'antd/es/table';
import { type CoinWhale, useCoinWhales } from 'api';
import { ButtonSelect } from 'shared/ButtonSelect';
import { OverviewWidget } from 'shared/OverviewWidget';
import { AccessShield } from 'shared/AccessShield';
import Table from 'shared/Table';
import { Wallet } from 'shared/Wallet';
import { ReadableNumber } from 'shared/ReadableNumber';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { ReadableDuration } from 'shared/ReadableDuration';
import { WhaleAssetBadge } from 'shared/WhaleAssetBadge';

type WhaleType = 'traders' | 'holders';

const useWhaleTableParams = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [isAscending, setIsAscending] = useState<boolean | undefined>(
    undefined,
  );
  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    sortBy,
    setSortBy,
    isAscending,
    setIsAscending,
  };
};

export function CoinWhaleListWidget({
  id,
  slug,
}: {
  id?: string;
  slug: string;
}) {
  const { t } = useTranslation('coin-radar');
  // const hasFlag = useHasFlag();
  const [type, setType] = useState<WhaleType>('traders');
  const tradersParams = useWhaleTableParams();
  const holderssParams = useWhaleTableParams();
  const {
    isAscending,
    page,
    pageSize,
    setIsAscending,
    setPage,
    setPageSize,
    setSortBy,
    sortBy,
  } = type === 'traders' ? tradersParams : holderssParams;

  const traders = useCoinWhales({
    type: 'traders',
    page,
    pageSize,
    sortBy,
    isAscending,
    slug,
  });
  const holders = useCoinWhales({
    type: 'holders',
    page,
    pageSize,
    sortBy,
    isAscending,
    slug,
  });
  const whales = type === 'traders' ? traders : holders;

  const columns = useMemo<Array<ColumnType<CoinWhale>>>(() => {
    let returnValue: Array<ColumnType<CoinWhale>> = [
      {
        title: t('coin-details.tabs.whale_list.table.address'),
        fixed: 'left',
        render: (_, row) => (
          <Wallet
            wallet={{
              address: row.holder_address,
              network: row.network_name,
            }}
          />
        ),
      },
    ];
    returnValue =
      type === 'traders'
        ? [
            ...returnValue,
            {
              title: t('coin-details.tabs.whale_list.table.trades'),
              align: 'right',
              render: (_, row) => (
                <ReadableNumber
                  value={row.asset.total_recent_transfers}
                  popup="never"
                />
              ),
            },
            {
              title: t('coin-details.tabs.whale_list.table.trading_pnl'),
              align: 'right',
              dataIndex: 'pnl',
              sorter: true,
              render: (_, row) => (
                <DirectionalNumber
                  value={row.asset.recent_trading_pnl}
                  label="$"
                  showSign
                />
              ),
            },
            {
              title: t('coin-details.tabs.whale_list.table.returns'),
              align: 'right',
              dataIndex: 'pnl_percent',
              sorter: true,
              render: (_, row) => (
                <DirectionalNumber
                  value={row.asset.recent_trading_pnl_percentage}
                  label="%"
                  showSign
                />
              ),
            },
            {
              title: t('coin-details.tabs.whale_list.table.volume_of_trades'),
              align: 'right',
              render: (_, row) => (
                <ReadableNumber
                  value={row.asset.total_recent_volume_transferred}
                  popup="never"
                  label="$"
                />
              ),
            },
            {
              title: t('coin-details.tabs.whale_list.table.avg_duration'),
              align: 'right',
              render: (_, row) => (
                <ReadableDuration
                  value={row.asset.recent_avg_trade_duration_seconds}
                />
              ),
            },
          ]
        : [
            ...returnValue,
            {
              title: t('coin-details.tabs.whale_list.table.badge'),
              render: (_, row) => <WhaleAssetBadge value={row.asset.label} />,
            },
            {
              title: t('coin-details.tabs.whale_list.table.volume'),
              render: (_, row) => (
                <ReadableNumber
                  value={row.asset.total_recent_volume_transferred}
                  label="$"
                />
              ),
            },
            {
              title: t('coin-details.tabs.whale_list.table.worth'),
              render: (_, row) => (
                <ReadableNumber value={row.asset.amount} label="$" />
              ),
            },
          ];
    return returnValue;
  }, [t, type]);

  useEffect(() => {
    if (whales.data?.count === 0) {
      setType((traders.data?.count ?? 0) > 0 ? 'traders' : 'holders');
    }
  }, [traders.data?.count, holders.data?.count, whales.data?.count]);

  return (
    <OverviewWidget
      id={id}
      title={t('coin-details.tabs.whale_list.title')}
      loading={traders.isInitialLoading || holders.isInitialLoading}
      empty={{
        enabled: traders.data?.count === 0 && holders.data?.count === 0,
        refreshButton: true,
        title: t('coin-details.tabs.whale_list.empty.title'),
        subtitle: t('coin-details.tabs.whale_list.empty.subtitle'),
      }}
      refreshing={whales.isRefetching}
      onRefresh={() => {
        setType('traders');
        void traders.refetch();
        void holders.refetch();
      }}
    >
      <div className="mb-4 w-full grow overflow-auto">
        <ButtonSelect
          options={[
            {
              value: 'traders',
              label: t('coin-details.tabs.whale_list.traders'),
              disabled: traders.data?.count === 0,
            },
            {
              value: 'holders',
              label: t('coin-details.tabs.whale_list.holders'),
              disabled: holders.data?.count === 0,
            },
          ]}
          value={type}
          onChange={setType}
        />
      </div>
      <AccessShield
        mode="table"
        sizes={{
          'guest': true,
          'free': true,
          'trial': 3,
          'pro': 3,
          'pro+': 3,
          'pro_max': false,
        }}
      >
        <Table
          dataSource={whales.data?.results ?? []}
          columns={columns}
          loading={whales.isRefetching && !whales.isFetched}
          rowKey="holder_address"
          pagination={{
            total: whales.data?.count ?? 1,
            current: page,
            showSizeChanger: true,
            pageSize,
            pageSizeOptions: [5, 10, 20],
          }}
          onChange={(pagination, _, sorter) => {
            setPage(pagination.current ?? 1);
            setPageSize(pagination.pageSize ?? 5);
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
        />
      </AccessShield>
    </OverviewWidget>
  );
}
