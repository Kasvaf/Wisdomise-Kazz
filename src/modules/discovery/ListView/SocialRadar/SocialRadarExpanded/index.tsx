import {
  type SocialRadarCoin,
  useSocialRadarCoins,
  useSocialRadarInfo,
} from 'api/discovery';
import { ReactComponent as Logo } from 'assets/monogram-green.svg';
import { bxShareAlt } from 'boxicons-quasar';
import { clsx } from 'clsx';
import BtnQuickBuy from 'modules/autoTrader/BuySellTrader/QuickBuy/BtnQuickBuy';
import QuickBuySettings from 'modules/autoTrader/BuySellTrader/QuickBuy/QuickBuySettings';
import { useEmbedView } from 'modules/embedded/useEmbedView';
import { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { AccessShield } from 'shared/AccessShield';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceInfo } from 'shared/CoinPriceInfo';
import Icon from 'shared/Icon';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { OverviewWidget } from 'shared/OverviewWidget';
import { SearchInput } from 'shared/SearchInput';
import { TableRank } from 'shared/TableRank';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { usePageState } from 'shared/usePageState';
import { Button } from 'shared/v1-components/Button';
import { Coin } from 'shared/v1-components/Coin';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { formatNumber } from 'utils/numbers';
import { RealtimeBadge } from '../../RealtimeBadge';
import { SocialRadarFilters } from '../SocialRadarFilters';
import { SocialRadarSentiment } from '../SocialRadarSentiment';
import SocialRadarSharingModal from '../SocialRadarSharingModal';
import { ReactComponent as SocialRadarIcon } from '../social-radar.svg';

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
            categories={row.symbol.categories}
            href={!isEmbeddedView}
            labels={row.symbol_labels}
            logo={row.symbol.logo_url}
            name={row.symbol.name}
            networks={row.networks}
            security={row.symbol_security?.data}
            slug={row.symbol.slug}
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
          <span className="flex items-center gap-1 text-v1-content-primary">
            <Logo className="inline-block size-4 grayscale" />
            {t('social-radar.table.sentiment.title')}
          </span>
        ),
        info: (
          <Trans i18nKey="social-radar.table.sentiment.info" ns="coin-radar" />
        ),
        width: 220,
        render: row => <SocialRadarSentiment mode="default" value={row} />,
      },
      {
        title: t('social-radar.table.price_info.title'),
        info: (
          <div className="[&_b]:font-medium [&_p]:text-v1-content-secondary [&_p]:text-xs">
            <Trans
              i18nKey="social-radar.table.price_info.info"
              ns="coin-radar"
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
        headerActions={
          <div className="flex gap-2">
            <QuickBuySettings showWallet source="social_radar" />
            <SearchInput
              onChange={query => setPageState(p => ({ ...p, query }))}
              placeholder={t('common.search_coin')}
              size="xs"
              value={pageState.query}
            />
          </div>
        }
        info={
          <p className="[&_b]:text-v1-content-primary [&_b]:underline">
            <Trans
              i18nKey="coin-radar:social-radar.table.description"
              ns="coin-radar"
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
        title={
          !isEmbeddedView && (
            <>
              <SocialRadarIcon className="size-6" />
              {t('social-radar.table.title')}
            </>
          )
        }
        titleSuffix={!isEmbeddedView && <RealtimeBadge />}
      >
        <SocialRadarFilters
          className="mb-4 w-full"
          onChange={newPageState =>
            setPageState({ query: pageState.query, ...newPageState })
          }
          value={pageState}
        />
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
            columns={columns}
            dataSource={coins.data}
            loading={coins.isLoading}
            rowHoverPrefix={row => (
              <Button
                fab
                onClick={async () => {
                  const isLoggedIn = await ensureAuthenticated();
                  if (isLoggedIn) {
                    setSelectedRow(row);
                    setOpenShareModal(true);
                  }
                }}
                size="xs"
                variant="secondary"
              >
                <Icon name={bxShareAlt} size={6} />
              </Button>
            )}
            rowHoverSuffix={row => (
              <BtnQuickBuy
                networks={row.networks}
                slug={row.symbol.slug}
                source="social_radar"
              />
            )}
            rowKey={r => r.symbol.slug}
            scrollable
            surface={2}
          />
        </AccessShield>
        {selectedRow && (
          <SocialRadarSharingModal
            coin={selectedRow}
            onClose={() => setOpenShareModal(false)}
            open={openShareModal}
          />
        )}
        {LoginModal}
      </OverviewWidget>
    </div>
  );
}
