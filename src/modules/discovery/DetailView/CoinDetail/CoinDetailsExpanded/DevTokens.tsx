import { type DevToken, useDevTokensQuery } from 'api/dev-tokens';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import type { EChartsOption } from 'echarts';
import { useUnifiedCoinDetails } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useMemo } from 'react';
import { ECharts } from 'shared/ECharts';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Token } from 'shared/v1-components/Token';

export default function DevTokens({
  id,
  title = false,
  className,
}: {
  id?: string;
  title?: boolean;
  className?: string;
}) {
  const { developer } = useUnifiedCoinDetails();
  const { data: devTokens, isPending } = useDevTokensQuery({
    devAddress: developer?.address,
  });
  const migratedCount = devTokens?.migrated_count ?? 0;
  const totalCount = devTokens?.total_count ?? 0;
  const nonMigratedCount = totalCount - migratedCount;
  const migratedPercentage = totalCount
    ? (migratedCount / totalCount) * 100
    : 0;

  const topMCToken = useMemo(() => {
    return devTokens?.tokens?.reduce((current, token) => {
      return +current.market_cap_usd > +token.market_cap_usd ? current : token;
    });
  }, [devTokens?.tokens]);

  const lastLaunchedToken = useMemo(() => {
    return devTokens?.tokens?.reduce((latest, token) => {
      return new Date(token.created_at) > new Date(latest.created_at)
        ? token
        : latest;
    });
  }, [devTokens?.tokens]);

  const options = useMemo(
    () =>
      ({
        color: ['#0eb396', '#e63866'],
        series: [
          {
            name: 'Migration Status',
            type: 'pie',
            radius: ['75%', '90%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: migratedCount, name: 'Migrated' },
              { value: nonMigratedCount, name: 'Non-migrated' },
            ],
          },
        ],
      }) as EChartsOption,
    [migratedCount, nonMigratedCount],
  );

  const columns = useMemo<Array<TableColumn<DevToken>>>(
    () => [
      {
        key: 'token',
        title: 'Token',
        render: row => (
          <Token
            abbreviation={row.symbol}
            address={row.contract_address}
            logo={row.image_uri}
            name={row.name}
            showAddress={false}
          />
        ),
      },
      {
        key: 'migrated',
        title: 'Migrated',
        render: row => (
          <span
            className={
              row.is_migrated
                ? 'text-v1-content-positive'
                : 'text-v1-content-negative'
            }
          >
            {row.is_migrated ? 'Yes' : 'No'}
          </span>
        ),
      },
      {
        key: 'mc',
        title: 'Market Cap',
        render: row => (
          <ReadableNumber
            format={{ decimalLength: 1 }}
            label="$"
            value={+row.market_cap_usd}
          />
        ),
      },
      {
        key: 'volume',
        title: '1h Volume',
        render: row => (
          <ReadableNumber
            format={{ decimalLength: 1 }}
            label="$"
            value={+row.volume_1h_usd}
          />
        ),
      },
    ],
    [],
  );

  return (
    <div
      className={clsx(
        'relative flex flex-col gap-4 overflow-auto overflow-x-hidden',
        className,
      )}
      id={id}
    >
      {title !== false && <h3 className="font-semibold text-sm">Dev Tokens</h3>}
      <div className="flex flex-wrap-reverse gap-2">
        <Table
          className="min-w-48 flex-1 basis-[calc(65%-0.5rem)]"
          columns={columns}
          dataSource={devTokens?.tokens}
          loading={isPending}
          rowClassName="text-xs"
          rowKey={row => row.contract_address}
          scrollable
          surface={1}
        />
        <div className="flex h-max min-w-48 flex-1 basis-[calc(35%-0.5rem)] flex-wrap items-start justify-center">
          <div className="w-full space-y-2 text-xs">
            <div className="rounded-xl bg-v1-surface-l1 p-3">
              <h2 className="mb-2">Token Stats</h2>
              <p className="mb-1 text-v1-content-primary/50">
                <span className="mr-2 inline-block size-2 rounded-lg bg-v1-background-positive" />
                Migrated: {migratedCount}
              </p>
              <p className="text-v1-content-primary/50">
                <span className="mr-2 inline-block size-2 rounded-lg bg-v1-background-negative" />
                Non-migrated: {nonMigratedCount}
              </p>
            </div>
            <div className="rounded-xl bg-v1-surface-l1 p-3">
              <h2 className="mb-2">Highlights</h2>
              <p className="mb-1 text-v1-content-primary/50">
                Top Market Cap: {topMCToken?.name} ($
                <ReadableNumber
                  format={{ decimalLength: 1, compactInteger: true }}
                  value={+(topMCToken?.market_cap_usd ?? '0')}
                />
                )
              </p>
              <p className="text-v1-content-primary/50">
                Last Token Launched:{' '}
                {dayjs(lastLaunchedToken?.created_at).fromNow()}
              </p>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute text-center">
              <p className="font-medium text-2xl">
                <ReadableNumber
                  format={{ decimalLength: 1 }}
                  value={migratedPercentage}
                />
                %
              </p>
              <p className="text-v1-content-primary/50 text-xs">Migrated</p>
            </div>
            <ECharts height={240} options={options} width={240} />
          </div>
        </div>
      </div>
    </div>
  );
}
