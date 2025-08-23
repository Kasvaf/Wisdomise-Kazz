import { type CoinRadarCoin, useCoinRadarCoins } from 'api/discovery';
import BtnQuickBuy from 'modules/autoTrader/BuySellTrader/QuickBuy/BtnQuickBuy';
import { UserTradingAssets } from 'modules/autoTrader/UserAssets';
import { useDiscoveryParams } from 'modules/discovery/lib';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessShield } from 'shared/AccessShield';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import { Coin } from 'shared/v1-components/Coin';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import useIsMobile from 'utils/useIsMobile';
import {
  CoinPreDetailModal,
  useCoinPreDetailModal,
} from '../CoinPreDetailModal';
import { SocialRadarSentiment } from '../SocialRadar/SocialRadarSentiment';
import { TechnicalRadarSentiment } from '../TechnicalRadar/TechnicalRadarSentiment';
import { homeSubscriptionsConfig } from './constants';
import useHotCoinsTour from './useHotCoinsTour';

export const CoinRadarCompact: FC<{ focus?: boolean }> = ({ focus }) => {
  const { t } = useTranslation('insight');

  const coins = useCoinRadarCoins({});
  useLoadingBadge(coins.isFetching);

  const isMobile = useIsMobile();
  useHotCoinsTour({
    enabled: !coins.isLoading && isMobile,
  });

  const [openModal, { closeModal, isModalOpen, selectedRow }] =
    useCoinPreDetailModal<CoinRadarCoin>({
      directNavigate: !focus,
      slug: r => r.symbol.slug,
    });

  const selectedRowSparklinePrices =
    selectedRow?.social_radar_insight?.signals_analysis?.sparkline?.prices ??
    selectedRow?.technical_radar_insight?.sparkline?.prices;

  const columns = useMemo<Array<TableColumn<CoinRadarCoin>>>(
    () => [
      {
        key: 'rank',
        className: 'max-w-2',
        render: row => <TableRank highlighted={row._highlighted} />,
      },
      {
        key: 'coin',
        render: row => (
          <Coin
            abbreviation={row.symbol.abbreviation}
            // name={row.symbol.name}
            categories={row.symbol.categories}
            extra={
              <>
                <DirectionalNumber
                  direction="auto"
                  format={{
                    decimalLength: 1,
                    minifyDecimalRepeats: true,
                  }}
                  label="%"
                  showIcon
                  showSign={false}
                  value={row.market_data?.price_change_percentage_24h}
                />
                <CoinMarketCap
                  className="text-xxs"
                  marketData={row.market_data}
                  singleLine
                />
              </>
            }
            href={false}
            labels={row.symbol_labels}
            logo={row.symbol.logo_url}
            networks={row.networks}
            security={row.symbol_security?.data}
            slug={row.symbol.slug}
          />
        ),
      },
      {
        key: 'sentiment',
        className: 'id-tour-sentiment',
        align: 'end',
        render: row => (
          <div className="flex items-center gap-1">
            {row.social_radar_insight && (
              <SocialRadarSentiment
                mode="tiny"
                value={row.social_radar_insight}
              />
            )}
            {row.technical_radar_insight && (
              <TechnicalRadarSentiment
                mode="tiny"
                value={row.technical_radar_insight}
              />
            )}
          </div>
        ),
      },
    ],
    [],
  );
  const params = useDiscoveryParams();
  const activeSlug = params.slugs?.[0];

  return (
    <div className="p-3">
      {focus && <UserTradingAssets className="mb-4" />}
      {focus && <h1 className="mb-4 text-sm">{t('table.mobile_title')}</h1>}
      <AccessShield mode="table" sizes={homeSubscriptionsConfig}>
        <Table
          chunkSize={10}
          columns={columns}
          dataSource={coins.data?.slice(0, 10) ?? []}
          isActive={r => r.symbol.slug === activeSlug}
          loading={coins.isLoading}
          onClick={r => openModal(r)}
          rowClassName="id-tour-row"
          rowHoverSuffix={row => (
            <BtnQuickBuy
              networks={row.networks}
              slug={row.symbol.slug}
              source="coin_radar"
            />
          )}
          rowKey={r => r.rank}
          scrollable={false}
          surface={1}
        />
      </AccessShield>

      <CoinPreDetailModal
        categories={selectedRow?.symbol.categories}
        coin={selectedRow?.symbol}
        labels={selectedRow?.symbol_labels}
        marketData={selectedRow?.market_data}
        networks={selectedRow?.networks}
        onClose={() => closeModal()}
        open={isModalOpen}
        security={selectedRow?.symbol_security?.data}
      >
        {selectedRowSparklinePrices && (
          <CoinPriceChart
            socialIndexes={
              selectedRow?.social_radar_insight?.signals_analysis?.sparkline
                ?.indexes
            }
            value={selectedRowSparklinePrices ?? []}
          />
        )}
        {selectedRow?.technical_radar_insight && (
          <TechnicalRadarSentiment
            className="w-full"
            mode="semi_expanded"
            value={selectedRow?.technical_radar_insight}
          />
        )}
        {selectedRow?.social_radar_insight && (
          <SocialRadarSentiment
            className="w-full"
            mode="expanded"
            value={selectedRow.social_radar_insight}
          />
        )}
      </CoinPreDetailModal>
    </div>
  );
};
