import { type TechnicalRadarCoin, useTechnicalRadarCoins } from 'api/discovery';
import { ReactComponent as Logo } from 'assets/monogram-green.svg';
import { bxShareAlt } from 'boxicons-quasar';
import BtnQuickBuy from 'modules/autoTrader/BuySellTrader/QuickBuy/BtnQuickBuy';
import { type FC, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { AccessShield } from 'shared/AccessShield';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceInfo } from 'shared/CoinPriceInfo';
import Icon from 'shared/Icon';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { TableRank } from 'shared/TableRank';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { usePageState } from 'shared/usePageState';
import { Button } from 'shared/v1-components/Button';
import { Coin } from 'shared/v1-components/Coin';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { ConfirmationBadgesInfo } from '../../ConfirmationWidget/ConfirmationBadge/ConfirmationBadgesInfo';
import { TechnicalRadarFilters } from '../../TechnicalRadarFilters';
import { TechnicalRadarSentiment } from '../../TechnicalRadarSentiment';
import TechnicalRadarSharingModal from '../../TechnicalRadarSharingModal';

export const TechnicalRadarCoinsTable: FC = () => {
  const { t } = useTranslation('market-pulse');
  const [pageState, setPageState] = usePageState<
    Parameters<typeof useTechnicalRadarCoins>[0]
  >('social-radar', {
    sortBy: 'rank',
    sortOrder: 'ascending',
  });
  const coins = useTechnicalRadarCoins(pageState);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TechnicalRadarCoin>();
  const [LoginModal, ensureAuthenticated] = useEnsureAuthenticated();

  const columns = useMemo<Array<TableColumn<TechnicalRadarCoin>>>(
    () => [
      {
        title: t('table.rank'),
        render: row => (
          <TableRank highlighted={row._highlighted}>{row.rank}</TableRank>
        ),
        width: 64,
      },
      {
        sticky: 'start',
        title: t('table.name'),
        render: row => (
          <Coin
            abbreviation={row.symbol.abbreviation}
            categories={row.symbol.categories}
            labels={row.symbol_labels}
            logo={row.symbol.logo_url}
            name={row.symbol.name}
            networks={row.networks}
            security={row.symbol_security?.data}
            slug={row.symbol.slug}
            truncate={false}
          />
        ),
        width: 220,
      },
      {
        title: (
          <span className="flex items-center gap-1 text-v1-content-primary">
            <Logo className="inline-block size-4 grayscale" />
            {t('table.technical_sentiment.title')}
          </span>
        ),
        info: <ConfirmationBadgesInfo />,
        width: 270,
        render: row => <TechnicalRadarSentiment mode="default" value={row} />,
      },
      {
        title: t('table.market_cap.title'),
        info: t('table.market_cap.info'),
        width: 140,
        render: row => (
          <>{row.data && <CoinMarketCap marketData={row.data} />}</>
        ),
      },
      {
        title: t('table.price_info.title'),
        info: (
          <div className="[&_b]:font-medium [&_p]:text-v1-content-secondary [&_p]:text-xs">
            <Trans i18nKey="table.price_info.info" ns="market-pulse" />
          </div>
        ),
        width: 240,
        render: row => (
          <>{row.data && <CoinPriceInfo marketData={row.data} />}</>
        ),
      },
    ],
    [t],
  );

  useLoadingBadge(coins.isFetching);

  return (
    <div>
      <TechnicalRadarFilters
        className="mb-4 w-full"
        onChange={newPageState => setPageState(newPageState)}
        value={pageState}
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
          className="max-h-[477px]"
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
              source="technical_radar"
            />
          )}
          rowKey={r => r.symbol.slug}
          scrollable
          surface={2}
        />
      </AccessShield>

      {selectedRow && (
        <TechnicalRadarSharingModal
          coin={selectedRow}
          onClose={() => setOpenShareModal(false)}
          open={openShareModal}
        />
      )}
      {LoginModal}
    </div>
  );
};
