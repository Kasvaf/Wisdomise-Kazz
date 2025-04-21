/* eslint-disable import/max-dependencies */
import { Fragment, useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { clsx } from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import { bxShareAlt } from 'boxicons-quasar';
import { Tooltip } from 'antd';
import { OverviewWidget } from 'shared/OverviewWidget';
import Table, { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { formatNumber } from 'utils/numbers';
import { CoinLabels } from 'shared/CoinLabels';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { DebugPin } from 'shared/DebugPin';
import { SearchInput } from 'shared/SearchInput';
import {
  useHasFlag,
  type SocialRadarCoin,
  useSocialRadarCoins,
  useSocialRadarInfo,
} from 'api';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceInfo } from 'shared/CoinPriceInfo';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import SocialRadarSharingModal from 'modules/insight/PageSocialRadar/components/SocialRadarSharingModal';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { RadarFilter } from 'modules/insight/RadarFilter';
import { SocialRadarSentiment } from '../SocialRadarSentiment';
import { SocialRadarFilters } from '../SocialRadarFilters';
import { ReactComponent as SocialRadarIcon } from '../social-radar.svg';
import { ReactComponent as Logo } from './logo.svg';
import { ReactComponent as Realtime } from './realtime.svg';

export function SocialRadarDesktop({ className }: { className?: string }) {
  const marketInfo = useSocialRadarInfo();
  const { isEmbeddedView } = useEmbedView();
  const hasFlag = useHasFlag();
  const { t } = useTranslation('coin-radar');
  const [tableProps, tableState, setTableState] = useTableState<
    Required<Parameters<typeof useSocialRadarCoins>[0]>
  >('', {
    page: 1,
    pageSize: 10,
    sortBy: 'rank',
    sortOrder: 'ascending',
    query: '',
    categories: [] as string[],
    networks: [] as string[],
    trendLabels: [] as string[],
    securityLabels: [] as string[],
    exchanges: [] as string[],
    sources: [] as string[],
    windowHours: 24,
  });

  const coins = useSocialRadarCoins(tableState);
  const topCoins = useSocialRadarCoins({ windowHours: tableState.windowHours });
  useLoadingBadge(coins.isFetching);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number>();
  const [selectedRow, setSelectedRow] = useState<SocialRadarCoin>();
  const [LoginModal, ensureAuthenticated] = useEnsureAuthenticated();

  const columns = useMemo<Array<ColumnType<SocialRadarCoin>>>(
    () => [
      {
        fixed: 'left',
        title: t('social-radar.table.rank'),
        render: (_, row, index) => (
          <div>
            <TableRank highlighted={row._highlighted}>{row.rank}</TableRank>
            <Tooltip
              open={index === hoveredRow}
              rootClassName="[&_.ant-tooltip-arrow]:!hidden [&_.ant-tooltip-inner]:!bg-transparent"
              placement="left"
              title={
                <Button
                  className="-mr-1 !px-1"
                  variant="secondary"
                  size="xs"
                  onClick={async () => {
                    setHoveredRow(undefined);
                    const isLoggedIn = await ensureAuthenticated();
                    if (isLoggedIn) {
                      setSelectedRow(row);
                      setOpenShareModal(true);
                    }
                  }}
                >
                  <Icon name={bxShareAlt} size={6} />
                </Button>
              }
            />
          </div>
        ),
        width: 50,
      },
      {
        title: t('social-radar.table.name'),
        render: (_, row) => <Coin coin={row.symbol} nonLink={isEmbeddedView} />,
        width: 200,
      },
      {
        colSpan: hasFlag('/coin-radar/social-radar?side-suggestion') ? 1 : 0,
        title: [
          <span
            key="1"
            className="flex items-center gap-1 text-v1-content-primary"
          >
            <DebugPin
              title="/coin-radar/social-radar?side-suggestion"
              color="orange"
            />
            <Logo className="inline-block size-4 grayscale" />
            {t('social-radar.table.sentiment.title')}
          </span>,
          <Fragment key="2">
            <Trans
              ns="coin-radar"
              i18nKey="social-radar.table.sentiment.info"
            />
          </Fragment>,
        ],
        width: 310,
        render: (_, row) => <SocialRadarSentiment value={row} mode="default" />,
      },
      {
        title: [
          t('social-radar.table.market_cap.title'),
          t('social-radar.table.market_cap.info'),
        ],
        width: 140,
        render: (_, row) => (
          <CoinMarketCap marketData={row.symbol_market_data} />
        ),
      },
      {
        title: [
          t('social-radar.table.price_info.title'),
          <div
            key="2"
            className="[&_b]:font-medium [&_p]:text-xs [&_p]:text-v1-content-secondary"
          >
            <Trans
              ns="coin-radar"
              i18nKey="social-radar.table.price_info.info"
            />
          </div>,
        ],
        width: 240,
        render: (_, row) => (
          <CoinPriceInfo marketData={row.symbol_market_data} />
        ),
      },
      {
        title: t('social-radar.table.labels.title'),
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
    [t, hasFlag, hoveredRow, ensureAuthenticated, isEmbeddedView],
  );
  return (
    <OverviewWidget
      className={clsx(
        'min-h-[670px] shrink-0 xl:min-h-[631px] 2xl:min-h-[640px]',
        className,
      )}
      title={
        isEmbeddedView ? undefined : (
          <>
            <SocialRadarIcon className="size-6" />
            {t('social-radar.table.title')}
            <Realtime />
          </>
        )
      }
      subtitle={
        isEmbeddedView ? undefined : (
          <div
            className={clsx(
              'w-[450px] mobile:hidden [&_b]:font-normal [&_b]:text-v1-content-primary',
              marketInfo.isLoading && '[&_b]:animate-pulse',
            )}
          >
            <Trans
              ns="coin-radar"
              i18nKey="coin-radar:social-radar.table.description"
              values={{
                posts: formatNumber(
                  marketInfo.data?.analyzed_messages ?? 4000,
                  {
                    compactInteger: true,
                    decimalLength: 0,
                    seperateByComma: true,
                    minifyDecimalRepeats: false,
                  },
                ),
              }}
            />
          </div>
        )
      }
      loading={coins.isLoading}
      empty={(topCoins.data ?? [])?.length === 0}
      headerActions={
        <SearchInput
          value={tableState.query}
          onChange={query => setTableState({ query })}
          placeholder={t('common.search_coin')}
          size="md"
        />
      }
    >
      <SocialRadarFilters
        value={tableState}
        onChange={newState => setTableState(newState)}
        className="mb-4 w-full"
        surface={3}
      />
      <RadarFilter
        radar="social-radar-24-hours"
        value={tableState}
        onChange={newState => setTableState(newState)}
        className="mb-4 w-full"
        surface={3}
      />
      <AccessShield
        mode="table"
        sizes={{
          'guest': true,
          'initial': 3,
          'free': 3,
          'pro': false,
          'pro+': false,
          'pro_max': false,
        }}
      >
        <Table
          columns={columns}
          dataSource={coins.data}
          rowKey={r => JSON.stringify(r.symbol)}
          tableLayout="fixed"
          onRow={(_, index) => ({
            onMouseEnter: () => setHoveredRow(index),
            onMouseLeave: () => setHoveredRow(undefined),
          })}
          {...tableProps}
        />
      </AccessShield>
      {selectedRow && (
        <SocialRadarSharingModal
          open={openShareModal}
          coin={selectedRow}
          onClose={() => setOpenShareModal(false)}
        />
      )}
      {LoginModal}
    </OverviewWidget>
  );
}
