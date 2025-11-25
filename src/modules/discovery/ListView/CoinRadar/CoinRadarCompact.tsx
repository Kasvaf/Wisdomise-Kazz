import BtnQuickBuy from 'modules/autoTrader/BuySellTrader/QuickBuy/BtnQuickBuy';
import QuickBuySettings from 'modules/autoTrader/BuySellTrader/QuickBuy/QuickBuySettings';
import { UserTradingAssets } from 'modules/autoTrader/UserAssets';
import { generateTokenLink } from 'modules/discovery/DetailView/CoinDetail/lib';
import { useDiscoveryParams } from 'modules/discovery/lib';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { type CoinRadarCoin, useCoinRadarCoins } from 'services/rest/discovery';
import { AccessShield } from 'shared/AccessShield';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import { useGlobalNetwork } from 'shared/useGlobalNetwork';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { Token } from 'shared/v1-components/Token';
import useIsMobile from 'utils/useIsMobile';
import { SocialRadarSentiment } from '../SocialRadar/SocialRadarSentiment';
import { TechnicalRadarSentiment } from '../TechnicalRadar/TechnicalRadarSentiment';
import { homeSubscriptionsConfig } from './constants';
import useHotCoinsTour from './useHotCoinsTour';

export const CoinRadarCompact: FC<{ focus?: boolean }> = ({ focus }) => {
  const { t } = useTranslation('insight');
  const [globalNetwork] = useGlobalNetwork();
  const coins = useCoinRadarCoins({});
  useLoadingBadge(coins.isFetching);

  const isMobile = useIsMobile();
  useHotCoinsTour({
    enabled: !coins.isLoading && isMobile,
  });

  const navigate = useNavigate();

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
          <Token
            abbreviation={row.symbol.abbreviation}
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
            labels={row.symbol_labels}
            link={false}
            logo={row.symbol.logo_url}
            networks={row.networks}
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
  const activeSlug = params.slugs?.[1];

  return (
    <div className="p-3">
      {focus && <UserTradingAssets className="mb-4" />}
      {focus && <h1 className="mb-4 text-sm">{t('table.mobile_title')}</h1>}
      <QuickBuySettings className="mb-4" source="coin_radar" surface={1} />
      <AccessShield mode="table" sizes={homeSubscriptionsConfig}>
        <Table
          chunkSize={10}
          columns={columns}
          dataSource={coins.data?.slice(0, 10) ?? []}
          isActive={r =>
            r.networks?.find(x => x.network.slug === globalNetwork)
              ?.contract_address === activeSlug
          }
          loading={coins.isLoading}
          onClick={r => {
            if (r.networks) {
              navigate(generateTokenLink(r.networks));
            }
          }}
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
    </div>
  );
};
