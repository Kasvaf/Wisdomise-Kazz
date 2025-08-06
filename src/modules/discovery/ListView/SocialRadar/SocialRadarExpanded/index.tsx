/* eslint-disable import/max-dependencies */
import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Trans, useTranslation } from 'react-i18next';
import { bxShareAlt } from 'boxicons-quasar';

import { OverviewWidget } from 'shared/OverviewWidget';
import { Coin } from 'shared/v1-components/Coin';
import { AccessShield } from 'shared/AccessShield';
import { formatNumber } from 'utils/numbers';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { SearchInput } from 'shared/SearchInput';
import {
  type SocialRadarCoin,
  useRadarsMetrics,
  useSocialRadarCoins,
  useSocialRadarInfo,
} from 'api/discovery';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceInfo } from 'shared/CoinPriceInfo';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { type TableColumn, Table } from 'shared/v1-components/Table';
import { usePageState } from 'shared/usePageState';
import BtnQuickBuy from 'modules/autoTrader/BuySellTrader/QuickBuy/BtnQuickBuy';
import QuickBuySettings from 'modules/autoTrader/BuySellTrader/QuickBuy/QuickBuySettings';
import { SocialRadarSentiment } from '../SocialRadarSentiment';
import { ReactComponent as SocialRadarIcon } from '../social-radar.svg';
import SocialRadarSharingModal from '../SocialRadarSharingModal';
import { SocialRadarFilters } from '../SocialRadarFilters';
import { RealtimeBadge } from '../../RealtimeBadge';
import { ReactComponent as Logo } from 'assets/monogram-green.svg';

export function SocialRadarExpanded() {
  const marketInfo = useSocialRadarInfo();
  const { isEmbeddedView } = useEmbedView();
  const { t } = useTranslation('coin-radar');
  const [pageState, setPageState] = usePageState<
    Parameters<typeof useSocialRadarCoins>[0]
  >('social-radar', {
    sortBy: 'rank',
    sortOrder: 'ascending',
  });

  const coins = useSocialRadarCoins(pageState);
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
        render: row => (
          <Coin
            abbreviation={row.symbol.abbreviation}
            name={row.symbol.name}
            slug={row.symbol.slug}
            logo={row.symbol.logo_url}
            categories={row.symbol.categories}
            labels={row.symbol_labels}
            networks={row.networks}
            security={row.symbol_security?.data}
            href={!isEmbeddedView}
            truncate={false}
          />
        ),
        width: 200,
      },
      {
        title: t('social-radar.table.market_cap.title'),
        info: t('social-radar.table.market_cap.info'),
        width: 140,
        render: row => <CoinMarketCap marketData={row.symbol_market_data} />,
      },
      {
        title: (
          <span className="text-v1-content-primary flex items-center gap-1">
            <Logo className="size-4 inline-block grayscale" />
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
        title: t('social-radar.table.price_info.title'),
        info: (
          <div className="[&_p]:text-v1-content-secondary [&_b]:font-medium [&_p]:text-xs">
            <Trans
              ns="coin-radar"
              i18nKey="social-radar.table.price_info.info"
            />
          </div>
        ),
        width: 240,
        render: row => <CoinPriceInfo marketData={row.symbol_market_data} />,
      },
    ],
    [t, isEmbeddedView],
  );
  return (
    <div className="p-3">
      <OverviewWidget
        className={clsx(
          'min-h-[670px] shrink-0 xl:min-h-[631px] 2xl:min-h-[640px]',
        )}
        title={
          !isEmbeddedView && (
            <>
              <SocialRadarIcon className="size-6" />
              {t('social-radar.table.title')}
            </>
          )
        }
        titleSuffix={!isEmbeddedView && <RealtimeBadge />}
        info={
          <p className="[&_b]:text-v1-content-primary [&_b]:underline">
            <Trans
              ns="coin-radar"
              i18nKey="coin-radar:social-radar.table.description"
              values={{
                posts: formatNumber(
                  marketInfo.data?.analyzed_messages ?? 4000,
                  {
                    compactInteger: true,
                    decimalLength: 0,
                    separateByComma: true,
                    minifyDecimalRepeats: false,
                  },
                ),
              }}
            />
          </p>
        }
        headerActions={
          <div className="flex gap-2">
            <QuickBuySettings source="social_radar" showWallet />
            <SearchInput
              value={pageState.query}
              onChange={query => setPageState(p => ({ ...p, query }))}
              placeholder={t('common.search_coin')}
              size="xs"
            />
          </div>
        }
      >
        <SocialRadarFilters
          value={pageState}
          onChange={newPageState =>
            setPageState({ query: pageState.query, ...newPageState })
          }
          className="mb-4 w-full"
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
            surface={2}
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
            rowHoverSuffix={row => (
              <BtnQuickBuy
                source="social_radar"
                slug={row.symbol.slug}
                networks={row.networks}
              />
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
    </div>
  );
}
