import type React from 'react';
import { useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { Trans, useTranslation } from 'react-i18next';
import { bxRightArrowAlt } from 'boxicons-quasar';
import { useStrategiesPerformanceBulk } from 'api';
import PageWrapper from 'modules/base/PageWrapper';
import Table from 'shared/Table';
import CoinsIcons from 'shared/CoinsIcons';
import PriceAreaChart from 'shared/PriceAreaChart';
import PriceChange from 'shared/PriceChange';
import { ProfileLink } from 'modules/account/PageProfile/ProfileLink';
import Icon from 'shared/Icon';
import Button from 'shared/Button';
import { TableArrayColumn } from './TableArrayColumn';

const PageMarketplace: React.FC = () => {
  const { t } = useTranslation();
  const { data: strategiesPerformanceBulk, isLoading } =
    useStrategiesPerformanceBulk({
      resolution: 'MONTH',
      groupByStrategy: true,
    });

  const strategiesPerformanceBulkWithRank = (strategiesPerformanceBulk || [])
    .map((row, idx) => ({
      ...row,
      pairs_performance: row.pairs_performance.filter(x => x.positions),
      rank: idx + 1,
    }))
    .filter(x => x.pairs_performance.length);

  const columns = useMemo<
    Array<ColumnType<(typeof strategiesPerformanceBulkWithRank)[number]>>
  >(() => {
    return [
      {
        title: '#',
        className: 'w-14 !pr-0',
        dataIndex: 'rank',
        render(value) {
          return <span className="text-white/40">{value}</span>;
        },
      },
      {
        title: t('marketplace:table.name'),
        className: 'w-auto',
        width: 'auto',
        render(_, record) {
          return (
            <div className="whitespace-nowrap">
              <p className="text-xxs font-light text-white/60">
                {t('marketplace:signaler')}
              </p>
              <p
                className="max-w-96 truncate text-xl font-medium mobile:max-w-40"
                title={record.name}
              >
                {record.name}
              </p>
              <ProfileLink
                className="mt-2"
                userId={record.owner.key}
                profile={record.owner.cprofile}
              />
            </div>
          );
        },
      },
      {
        className: 'min-w-42 w-48',
        title: t('marketplace:table.coin'),
        render(_, record) {
          return (
            <TableArrayColumn>
              {record.pairs_performance.map(({ pair }) => (
                <div
                  className="inline-flex items-center justify-start gap-3"
                  key={pair.name}
                >
                  <CoinsIcons
                    className="size-8 shrink-0"
                    coins={[pair.base.name]}
                  />
                  <div className="whitespace-nowrap">
                    <p className="text-sm font-light">{pair.display_name}</p>
                    <p className="rounded-lg bg-black/10 px-1 text-xxs font-light text-white/80">
                      {pair.base.name}/{pair.quote.name}
                    </p>
                  </div>
                </div>
              ))}
            </TableArrayColumn>
          );
        },
      },
      {
        className: 'min-w-48 w-56',
        title: (
          <Trans i18nKey="table.pl" ns="marketplace">
            P/L <span className="ml-1 text-xxs opacity-60">Monthly</span>
          </Trans>
        ),
        render(_, record) {
          return (
            <TableArrayColumn>
              {record.pairs_performance.map(pairPerf => (
                <div key={pairPerf.pair.name}>
                  <div className="w-24 text-center">
                    <PriceChange value={pairPerf.pnl} colorize valueToFixed />
                    <div className="mt-2 w-full">
                      <PriceAreaChart
                        data={pairPerf.pnl_timeseries.map(({ v: y }, x) => ({
                          y,
                          x,
                        }))}
                        height={18}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </TableArrayColumn>
          );
        },
      },
      {
        className: 'min-w-48 w-56',
        title: (
          <Trans i18nKey="table.max_drawdown" ns="marketplace">
            Max Drawdown
            <span className="ml-1 text-xxs opacity-60">Monthly</span>
          </Trans>
        ),
        render(_, record) {
          return (
            <TableArrayColumn>
              {record.pairs_performance.map(pairPerf => (
                <div
                  className="inline-flex flex-col items-start justify-center"
                  key={pairPerf.pair.name}
                >
                  <PriceChange
                    value={pairPerf.max_drawdown}
                    colorize
                    valueToFixed
                  />
                </div>
              ))}
            </TableArrayColumn>
          );
        },
      },
      {
        className: 'min-w-10 w-10',
        title: t('marketplace:table.action'),
        render(_, record) {
          return (
            <TableArrayColumn>
              {record.pairs_performance.map(pairPerf => (
                <div
                  className="inline-flex flex-col items-start justify-center"
                  key={pairPerf.pair.name}
                >
                  <Button
                    to={`/insight/coins/signaler?strategy=${record.strategy_key}&coin=${pairPerf.pair.name}`}
                    variant="alternative"
                    className="!p-2 !pl-3 text-sm !font-normal"
                  >
                    {t('marketplace:table.detail')}
                    <Icon name={bxRightArrowAlt} size={18} />
                  </Button>
                </div>
              ))}
            </TableArrayColumn>
          );
        },
      },
    ];
  }, [t]);

  return (
    <PageWrapper loading={isLoading}>
      <h1 className="mb-2 text-lg font-bold">{t('marketplace:page-title')}</h1>
      <p className="mb-10 text-xs leading-relaxed text-white/60">
        {t('base:menu.marketplace.subtitle')}
      </p>
      <Table
        rootClassName="[&_tbody_tr:nth-child(even)]:bg-black/15 bg-transparent"
        columns={columns}
        dataSource={strategiesPerformanceBulkWithRank}
        className="w-full overflow-auto"
        rowKey="strategy_key"
      />
    </PageWrapper>
  );
};

export default PageMarketplace;
