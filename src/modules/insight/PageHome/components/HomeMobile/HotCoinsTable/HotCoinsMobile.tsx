import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type CoinRadarCoin, useCoinRadarCoins, useHasFlag } from 'api';
import { NetworkSelect } from 'shared/NetworkSelect';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { SocialSentiment } from 'modules/insight/PageSocialRadar/components/SocialSentiment';
import { TechnicalSentiment } from 'modules/insight/PageTechnicalRadar/components/TechnicalSentiment';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinLabels } from 'shared/CoinLabels';
import { AccessShield } from 'shared/AccessShield';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { CoinPreDetailModal } from 'modules/insight/CoinPreDetailModal';
import { CoinPriceChart } from 'shared/CoinPriceChart';

export const HotCoinsMobile = () => {
  const { t } = useTranslation('insight');
  const hasFlag = useHasFlag();
  const [network, setNetwork] = useSearchParamAsState<string>(
    'network',
    hasFlag('/trader-positions?mobile') ? 'solana' : '',
  );

  const coins = useCoinRadarCoins({
    networks: network ? [network] : [],
  });

  const [selectedRow, setSelectedRow] = useState<null | CoinRadarCoin>(null);
  const [modal, setModal] = useState(false);

  const columns = useMemo<Array<MobileTableColumn<CoinRadarCoin>>>(
    () => [
      {
        key: 'rank',
        className: 'max-w-6 min-w-2 text-start text-xs font-medium',
        render: row => row.rank,
      },
      {
        key: 'coin',
        render: row => (
          <Coin
            coin={row.symbol}
            imageClassName="size-7"
            className="text-sm"
            truncate={75}
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
                mode="icon_bar"
              />
            )}
            {row.technical_radar_insight && (
              <TechnicalSentiment
                value={row.technical_radar_insight}
                mode="icon_bar"
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
          value={network || undefined}
          allowClear
          multiple={false}
          onChange={newNetwork => setNetwork(newNetwork ?? '')}
          size="sm"
          valueType="slug"
          filter="coin-radar"
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
          onClick={r => {
            setSelectedRow(r);
            setModal(true);
          }}
        />
      </AccessShield>

      <CoinPreDetailModal
        slug={selectedRow?.symbol.slug}
        open={modal}
        onClose={() => setModal(false)}
      >
        {selectedRow?.social_radar_insight?.signals_analysis?.sparkline && (
          <CoinPriceChart
            value={
              selectedRow?.social_radar_insight?.signals_analysis?.sparkline
                ?.prices ?? []
            }
            socialIndexes={
              selectedRow?.social_radar_insight?.signals_analysis?.sparkline
                .indexes
            }
          />
        )}
        {selectedRow?.technical_radar_insight && (
          <TechnicalSentiment
            value={selectedRow?.technical_radar_insight}
            mode="semi_expanded"
          />
        )}
        {selectedRow?.social_radar_insight && (
          <SocialSentiment
            value={selectedRow.social_radar_insight}
            mode="expanded"
          />
        )}
      </CoinPreDetailModal>
    </div>
  );
};
