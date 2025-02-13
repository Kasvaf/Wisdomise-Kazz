import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type CoinRadarCoin, useCoinRadarCoins } from 'api';
import { NetworkSelect } from 'shared/NetworkSelect';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { SocialSentiment } from 'modules/insight/PageSocialRadar/components/SocialSentiment';
import { TechnicalSentiment } from 'modules/insight/PageTechnicalRadar/components/TechnicalSentiment';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinLabels } from 'shared/CoinLabels';
import { AccessShield } from 'shared/AccessShield';
import CoinPreDetailModal from '../CoinPreDetailModal';

export const HotCoinsMobile = () => {
  const { t } = useTranslation('insight');
  const [network, setNetwork] = useState<string | undefined>(undefined);

  const coins = useCoinRadarCoins({
    networks: network ? [network] : [],
  });

  const [detailSlug, setDetailSlug] = useState('');

  const columns = useMemo<Array<MobileTableColumn<CoinRadarCoin>>>(
    () => [
      {
        key: 'rank',
        className: 'max-w-6 min-w-2 text-start text-xs font-medium',
        render: row => row.rank,
      },
      {
        key: 'coin',
        className: 'min-w-28 max-w-28 text-sm',
        render: row => (
          <Coin
            coin={row.symbol}
            imageClassName="size-7"
            truncate={60}
            nonLink={true}
            abbrevationSuffix={
              <DirectionalNumber
                className="ms-1"
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
            }
          />
        ),
      },
      {
        key: 'sentiment',
        render: row => (
          <div className="flex items-center gap-4">
            {row.social_radar_insight && (
              <SocialSentiment
                value={row.social_radar_insight}
                detailsLevel={1}
              />
            )}
            {row.technical_radar_insight && (
              <TechnicalSentiment
                value={row.technical_radar_insight}
                detailsLevel={1}
              />
            )}
          </div>
        ),
      },
      {
        key: 'labels',
        className: 'max-w-24 min-w-16',
        render: row => (
          <div className="flex flex-col items-end justify-center gap-2">
            <CoinLabels
              categories={row.symbol.categories}
              labels={row.symbol_labels}
              networks={row.networks}
              security={row.symbol_security?.data}
              coin={row.symbol}
              mini
            />
            <CoinMarketCap
              marketData={row.market_data}
              singleLine
              className="text-xxs"
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm">{t('table.mobile_title')}</h1>
        </div>
        <NetworkSelect
          value={network}
          allowClear
          multiple={false}
          onChange={setNetwork}
          size="sm"
          valueType="slug"
          filter="social-radar-24-hours"
          surface={2}
        />
      </div>
      <AccessShield
        mode="mobile_table"
        sizes={{
          'guest': true,
          'free': true,
          'trial': 3,
          'pro': 3,
          'pro+': false,
          'pro_max': false,
        }}
      >
        <MobileTable
          columns={columns}
          dataSource={coins.data?.slice(0, 20) ?? []}
          loading={coins.isLoading}
          rowKey={r => r.rank}
          surface={2}
          onClick={r => r.symbol.slug && setDetailSlug(r.symbol.slug)}
        />
      </AccessShield>

      <CoinPreDetailModal slug={detailSlug} onClose={() => setDetailSlug('')} />
    </div>
  );
};
