// import { Coin } from 'shared/Coin';
import { type CoinRadarCoin, useCoinRadarCoins } from 'api/discovery';
import { ReactComponent as Logo } from 'assets/monogram-green.svg';
import BtnQuickBuy from 'modules/autoTrader/BuySellTrader/QuickBuy/BtnQuickBuy';
import QuickBuySettings from 'modules/autoTrader/BuySellTrader/QuickBuy/QuickBuySettings';
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { AccessShield } from 'shared/AccessShield';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { OverviewWidget } from 'shared/OverviewWidget';
import { TableRank } from 'shared/TableRank';
import { Coin } from 'shared/v1-components/Coin';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { SocialRadarSentiment } from '../../SocialRadar/SocialRadarSentiment';
import { ConfirmationBadgesInfo } from '../../TechnicalRadar/ConfirmationWidget/ConfirmationBadge/ConfirmationBadgesInfo';
import { TechnicalRadarSentiment } from '../../TechnicalRadar/TechnicalRadarSentiment';
import { homeSubscriptionsConfig } from '../constants';
import { EmptySentiment } from '../EmptySentiment';
import useHotCoinsTour from '../useHotCoinsTour';
import { ReactComponent as SocialRadarIcon } from './social_radar.svg';
import { ReactComponent as TechnicalRadarIcon } from './technical_radar.svg';

export function CoinRadarExpanded({ className }: { className?: string }) {
  const { t } = useTranslation('insight');

  const coins = useCoinRadarCoins({});
  useLoadingBadge(coins.isFetching);
  const columns = useMemo<Array<TableColumn<CoinRadarCoin>>>(
    () => [
      {
        title: t('table.rank'),
        key: 'rank',
        render: row => (
          <TableRank highlighted={row._highlighted}>{row.rank}</TableRank>
        ),
        width: 64,
      },
      {
        title: t('table.name'),
        sticky: 'start',
        render: row => (
          <Coin
            abbreviation={row.symbol.abbreviation}
            categories={row.symbol.categories}
            labels={row.symbol_labels}
            logo={row.symbol.logo_url}
            name={row.symbol.name}
            networks={row.networks}
            slug={row.symbol.slug}
            truncate={false}
          />
        ),
        width: 220,
      },
      {
        title: t('coin-radar:social-radar.table.market_cap.title'),
        info: t('coin-radar:social-radar.table.market_cap.info'),
        width: 140,
        render: row => <CoinMarketCap marketData={row.market_data} />,
      },
      {
        key: 'social_radar_sentiment',
        title: (
          <span className="flex items-center gap-1">
            <SocialRadarIcon className="inline-block size-4 grayscale" />
            {t('table.social_radar_sentiment')}
          </span>
        ),
        info: (
          <Trans
            i18nKey="coin-radar:social-radar.table.sentiment.info"
            ns="coin-radar"
          />
        ),
        width: 250,
        render: row =>
          row.social_radar_insight ? (
            <SocialRadarSentiment
              mode="default"
              value={row.social_radar_insight}
            />
          ) : (
            <EmptySentiment value="social_radar" />
          ),
      },
      {
        key: 'technical_radar_sentiment',
        title: (
          <span className="flex items-center gap-1">
            <TechnicalRadarIcon className="inline-block size-4 grayscale" />
            {t('table.technical_radar_sentiment')}
          </span>
        ),
        info: <ConfirmationBadgesInfo key="2" />,
        width: 270,
        render: row =>
          row.technical_radar_insight ? (
            <TechnicalRadarSentiment
              mode="default"
              value={row.technical_radar_insight}
            />
          ) : (
            <EmptySentiment value="technical_radar" />
          ),
      },
    ],
    [t],
  );

  useHotCoinsTour({
    enabled: !coins.isLoading,
  });
  return (
    <div className="p-3">
      <OverviewWidget
        className="min-h-[500px]"
        headerActions={<QuickBuySettings showWallet source="coin_radar" />}
        title={
          <>
            <Logo className="size-6 shrink-0" />
            {t('base:menu.coin-radar.full-title')}
          </>
        }
      >
        <AccessShield mode="table" sizes={homeSubscriptionsConfig}>
          <Table
            chunkSize={10}
            className={className}
            columns={columns}
            dataSource={coins.data?.slice(0, 10)}
            loading={coins.isLoading}
            rowClassName="id-tour-row"
            rowHoverSuffix={row => (
              <BtnQuickBuy
                networks={row.networks}
                slug={row.symbol.slug}
                source="coin_radar"
              />
            )}
            rowKey={(r, i) => `${r.symbol.slug} ${i}`}
            scrollable
            surface={2}
          />
        </AccessShield>
      </OverviewWidget>
    </div>
  );
}
