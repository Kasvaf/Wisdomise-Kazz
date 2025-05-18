/* eslint-disable import/max-dependencies */
import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import { bxShareAlt } from 'boxicons-quasar';

import { OverviewWidget } from 'shared/OverviewWidget';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { formatNumber } from 'utils/numbers';
import { CoinLabels } from 'shared/CoinLabels';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { SearchInput } from 'shared/SearchInput';
import {
  type SocialRadarCoin,
  useRadarsMetrics,
  useSocialRadarCoins,
  useSocialRadarInfo,
} from 'api';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceInfo } from 'shared/CoinPriceInfo';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { RadarFilter } from 'modules/discovery/ListView/RadarFilter';
import { type TableColumn, Table } from 'shared/v1-components/Table';
import { usePageState } from 'shared/usePageState';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Badge } from 'shared/v1-components/Badge';
import { SocialRadarSentiment } from '../SocialRadarSentiment';
import { ReactComponent as SocialRadarIcon } from '../social-radar.svg';
import SocialRadarSharingModal from '../SocialRadarSharingModal';
import { ReactComponent as Logo } from './logo.svg';

export function SocialRadarExpanded() {
  const marketInfo = useSocialRadarInfo();
  const { isEmbeddedView } = useEmbedView();
  const { t } = useTranslation('coin-radar');
  const [tableState, setTableState] = usePageState<
    Required<Parameters<typeof useSocialRadarCoins>[0]>
  >('social-radar', {
    sortBy: 'rank',
    sortOrder: 'ascending',
    query: '',
    categories: [] as string[],
    networks: [] as string[],
    trendLabels: [] as string[],
    securityLabels: [] as string[],
    exchanges: [] as string[],
    sources: [] as string[],
  });

  const coins = useSocialRadarCoins(tableState);
  const metrics = useRadarsMetrics();
  const socialRadarMetrics = metrics.data?.social_radar;
  useLoadingBadge(coins.isFetching);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SocialRadarCoin>();
  const [LoginModal, ensureAuthenticated] = useEnsureAuthenticated();

  const columns = useMemo<Array<TableColumn<SocialRadarCoin>>>(
    () => [
      {
        title: t('social-radar.table.rank'),
        render: row => (
          <TableRank highlighted={row._highlighted}>{row.rank}</TableRank>
        ),
        width: 64,
      },
      {
        title: t('social-radar.table.name'),
        sticky: 'start',
        render: row => <Coin coin={row.symbol} nonLink={isEmbeddedView} />,
        width: 200,
      },
      {
        title: (
          <span className="flex items-center gap-1 text-v1-content-primary">
            <Logo className="inline-block size-4 grayscale" />
            {t('social-radar.table.sentiment.title')}
          </span>
        ),
        info: (
          <Trans ns="coin-radar" i18nKey="social-radar.table.sentiment.info" />
        ),
        width: 220,
        render: row => <SocialRadarSentiment value={row} mode="default" />,
      },
      {
        title: t('social-radar.table.market_cap.title'),
        info: t('social-radar.table.market_cap.info'),
        width: 140,
        render: row => <CoinMarketCap marketData={row.symbol_market_data} />,
      },
      {
        title: t('social-radar.table.price_info.title'),
        info: (
          <div className="[&_b]:font-medium [&_p]:text-xs [&_p]:text-v1-content-secondary">
            <Trans
              ns="coin-radar"
              i18nKey="social-radar.table.price_info.info"
            />
          </div>
        ),
        width: 240,
        render: row => <CoinPriceInfo marketData={row.symbol_market_data} />,
      },
      {
        title: t('social-radar.table.labels.title'),
        render: row => (
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
    [t, isEmbeddedView],
  );
  return (
    <OverviewWidget
      className={clsx(
        'min-h-[670px] shrink-0 xl:min-h-[631px] 2xl:min-h-[640px]',
      )}
      title={
        isEmbeddedView ? undefined : (
          <>
            <SocialRadarIcon className="size-6" />
            {t('social-radar.table.title')}
            <Badge variant="positive" ticking>
              {'Realtime'}
            </Badge>
            {typeof socialRadarMetrics?.max_average_win_rate === 'number' && (
              <Badge variant="wsdm">
                <span className="opacity-70">{'Winrate:'}</span>
                <ReadableNumber
                  value={socialRadarMetrics.max_average_win_rate * 100}
                  format={{
                    decimalLength: 1,
                  }}
                  popup="never"
                  label="%"
                />
              </Badge>
            )}
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
      headerActions={
        <SearchInput
          value={tableState.query}
          onChange={query => setTableState(p => ({ ...p, query }))}
          placeholder={t('common.search_coin')}
          size="md"
        />
      }
    >
      <RadarFilter
        radar="social-radar-24-hours"
        value={tableState}
        onChange={newState => setTableState(p => ({ ...p, ...newState }))}
        className="mb-4 w-full"
        surface={3}
      />
      <AccessShield
        mode="table"
        sizes={{
          guest: true,
          initial: true,
          free: true,
          vip: false,
        }}
      >
        <Table
          columns={columns}
          dataSource={coins.data}
          rowKey={r => r.symbol.slug}
          loading={coins.isLoading}
          scrollable
          rowHoverPrefix={row => (
            <Button
              variant="secondary"
              fab
              size="xs"
              onClick={async () => {
                const isLoggedIn = await ensureAuthenticated();
                if (isLoggedIn) {
                  setSelectedRow(row);
                  setOpenShareModal(true);
                }
              }}
            >
              <Icon name={bxShareAlt} size={6} />
            </Button>
          )}
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
