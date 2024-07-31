import { useMemo, memo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { clsx } from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { useStrategiesPerformanceBulk } from 'api';
import Table from 'shared/Table';
import CoinsIcons from 'shared/CoinsIcons';
import PriceAreaChart from 'shared/PriceAreaChart';
import PriceChange from 'shared/PriceChange';
import Icon from 'shared/Icon';

const UserSignalers = memo<{
  className?: string;
  userId?: string;
}>(({ userId, className }) => {
  const { t } = useTranslation();
  const { data: signalers, isLoading } = useStrategiesPerformanceBulk({
    resolution: 'MONTH',
    groupByStrategy: false,
    userId,
  });

  const signalersWithRank = (signalers || []).map((row, index) => ({
    ...row,
    rank: index + 1,
  }));

  const columns = useMemo<
    Array<ColumnType<(typeof signalersWithRank)[number]>>
  >(() => {
    return [
      {
        title: '#',
        className: 'w-14',
        dataIndex: 'rank',
        sorter: (a, b) => a.rank - b.rank,
        render(value) {
          return <span className="text-white/60">{value}</span>;
        },
      },
      {
        title: t('accounts:page-public-profile.signalers-table.name'),
        className: 'w-auto',
        width: 'auto',
        render(_, record) {
          return (
            <span className="block max-w-56 truncate text-lg group-hover:text-white/70 mobile:text-base">
              {record.name}
            </span>
          );
        },
      },
      {
        className: 'min-w-42 w-48',
        title: t('accounts:page-public-profile.signalers-table.pair'),
        render(_, { pair }) {
          return (
            <div className="inline-flex items-center justify-start gap-2 whitespace-nowrap mobile:gap-4">
              <CoinsIcons
                className="size-8 shrink-0"
                coins={[pair.base.name]}
              />
              <div>
                <p className="text-sm font-light">{pair.display_name}</p>
                <p className="rounded-lg bg-black/10 px-1 text-xxs font-light text-white/80">
                  {pair.base.name}/{pair.quote.name}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        className: 'min-w-48 w-56',
        title: (
          <Trans i18nKey="page-public-profile.signalers-table.pl" ns="accounts">
            P/L <span className="ml-1 text-xxs opacity-60">Monthly</span>
          </Trans>
        ),
        render(_, record) {
          return (
            <div className="w-24 text-center">
              <PriceChange value={record.pnl} colorize valueToFixed />
              <div className="mt-2 w-full">
                <PriceAreaChart
                  data={record.pnl_timeseries.map(({ v: y }, x) => ({
                    y,
                    x,
                  }))}
                  height={18}
                />
              </div>
            </div>
          );
        },
      },
      {
        className: 'min-w-48 w-56',
        title: (
          <Trans
            i18nKey="page-public-profile.signalers-table.max_drawdown"
            ns="accounts"
          >
            Max Drawdown
            <span className="ml-1 text-xxs opacity-60">Monthly</span>
          </Trans>
        ),
        render(_, record) {
          return (
            <PriceChange
              className="!justify-start"
              value={record.max_drawdown}
              colorize
              valueToFixed
            />
          );
        },
      },
      {
        className: 'min-w-10 w-10',
        title: t('marketplace:table.action'),
        render(_, record) {
          return (
            <Link
              to={`/insight/coins/signaler?coin=${record.pair.name}&strategy=${record.strategy_key}`}
              className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg bg-white/10 p-2 text-xs hover:bg-white/20 hover:text-white"
            >
              {t('marketplace:table.detail')}
              <Icon name={bxRightArrowAlt} size={18} />
            </Link>
          );
        },
      },
    ];
  }, [t]);

  return (
    <Table
      loading={isLoading}
      rootClassName="[&_tbody_tr:nth-child(even)]:bg-black/15 bg-transparent"
      columns={columns}
      dataSource={signalersWithRank}
      className={clsx('w-full overflow-auto', className)}
      rowKey="rank"
    />
  );
});

UserSignalers.displayName = 'UserSignalers';

export default UserSignalers;
