/* eslint-disable import/max-dependencies */
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { type CoinRadarCoin, useCoinRadarCoins } from 'api/discovery';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { AccessShield } from 'shared/AccessShield';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import { UserTradingAssets } from 'modules/autoTrader/UserAssets';
import useIsMobile from 'utils/useIsMobile';
import { useDiscoveryRouteMeta } from 'modules/discovery/useDiscoveryRouteMeta';
import { Coin } from 'shared/v1-components/Coin';
import {
  CoinPreDetailModal,
  useCoinPreDetailModal,
} from '../CoinPreDetailModal';
import { TechnicalRadarSentiment } from '../TechnicalRadar/TechnicalRadarSentiment';
import { SocialRadarSentiment } from '../SocialRadar/SocialRadarSentiment';
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
            slug={row.symbol.slug}
            logo={row.symbol.logo_url}
            categories={row.symbol.categories}
            labels={row.symbol_labels}
            networks={row.networks}
            security={row.symbol_security?.data}
            href={false}
            extra={
              <>
                <DirectionalNumber
                  value={row.market_data?.price_change_percentage_24h}
                  label="%"
                  direction="auto"
                  showIcon
                  showSign={false}
                  format={{
                    decimalLength: 1,
                    minifyDecimalRepeats: true,
                  }}
                />
                <CoinMarketCap
                  marketData={row.market_data}
                  singleLine
                  className="text-xxs"
                />
              </>
            }
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
                value={row.social_radar_insight}
                mode="tiny"
              />
            )}
            {row.technical_radar_insight && (
              <TechnicalRadarSentiment
                value={row.technical_radar_insight}
                mode="tiny"
              />
            )}
          </div>
        ),
      },
    ],
    [],
  );
  const {
    params: { slug: activeSlug },
  } = useDiscoveryRouteMeta();

  return (
    <div className="p-3">
      {focus && <UserTradingAssets className="mb-4" />}
      {focus && <h1 className="mb-4 text-sm">{t('table.mobile_title')}</h1>}
      <AccessShield mode="table" sizes={homeSubscriptionsConfig}>
        <Table
          rowClassName="id-tour-row"
          columns={columns}
          dataSource={coins.data?.slice(0, 10) ?? []}
          chunkSize={10}
          loading={coins.isLoading}
          rowKey={r => r.rank}
          surface={2}
          onClick={r => openModal(r)}
          scrollable={false}
          isActive={r => r.symbol.slug === activeSlug}
        />
      </AccessShield>

      <CoinPreDetailModal
        coin={selectedRow?.symbol}
        categories={selectedRow?.symbol.categories}
        labels={selectedRow?.symbol_labels}
        marketData={selectedRow?.market_data}
        networks={selectedRow?.networks}
        security={selectedRow?.symbol_security?.data}
        open={isModalOpen}
        onClose={() => closeModal()}
      >
        {selectedRowSparklinePrices && (
          <CoinPriceChart
            value={selectedRowSparklinePrices ?? []}
            socialIndexes={
              selectedRow?.social_radar_insight?.signals_analysis?.sparkline
                ?.indexes
            }
          />
        )}
        {selectedRow?.technical_radar_insight && (
          <TechnicalRadarSentiment
            value={selectedRow?.technical_radar_insight}
            mode="semi_expanded"
            className="w-full"
          />
        )}
        {selectedRow?.social_radar_insight && (
          <SocialRadarSentiment
            value={selectedRow.social_radar_insight}
            mode="expanded"
            className="w-full"
          />
        )}
      </CoinPreDetailModal>
    </div>
  );
};
