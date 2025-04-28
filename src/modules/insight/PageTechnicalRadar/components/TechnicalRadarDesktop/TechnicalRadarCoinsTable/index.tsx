/* eslint-disable import/max-dependencies */
import { useMemo, type FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { bxShareAlt } from 'boxicons-quasar';

import { type TechnicalRadarCoin, useTechnicalRadarCoins } from 'api';
import { AccessShield } from 'shared/AccessShield';
import { Coin } from 'shared/Coin';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceInfo } from 'shared/CoinPriceInfo';
import { CoinLabels } from 'shared/CoinLabels';
import TechnicalRadarSharingModal from 'modules/insight/PageTechnicalRadar/components/TechnicalRadarSharingModal';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { useLoadingBadge } from 'shared/LoadingBadge';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { TableRank } from 'shared/TableRank';
import { RadarFilter } from 'modules/insight/RadarFilter';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { usePageState } from 'shared/usePageState';
import { ConfirmationBadgesInfo } from '../../ConfirmationWidget/ConfirmationBadge/ConfirmationBadgesInfo';
import { TechnicalRadarSentiment } from '../../TechnicalRadarSentiment';
import { ReactComponent as Logo } from './logo.svg';

export const TechnicalRadarCoinsTable: FC = () => {
  const { t } = useTranslation('market-pulse');
  const [tableState, setTableState] = usePageState<
    Parameters<typeof useTechnicalRadarCoins>[0]
  >('overviewTable', {
    sortBy: 'rank',
    sortOrder: 'ascending',
    query: '',
    networks: [],
    categories: [],
  });
  const coins = useTechnicalRadarCoins(tableState);
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
        render: row => <Coin coin={row.symbol} />,
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
          <div className="[&_b]:font-medium [&_p]:text-xs [&_p]:text-v1-content-secondary">
            <Trans i18nKey="table.price_info.info" ns="market-pulse" />
          </div>
        ),
        width: 240,
        render: row => (
          <>{row.data && <CoinPriceInfo marketData={row.data} />}</>
        ),
      },
      {
        title: t('table.labels'),
        className: 'min-h-16 min-w-72',
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
    [t],
  );

  useLoadingBadge(coins.isFetching);

  return (
    <div>
      <RadarFilter
        radar="technical-radar"
        value={tableState}
        onChange={newState => setTableState(newState)}
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
          className="max-h-[500px] overflow-y-auto"
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
        <TechnicalRadarSharingModal
          open={openShareModal}
          coin={selectedRow}
          onClose={() => setOpenShareModal(false)}
        />
      )}
      {LoginModal}
    </div>
  );
};
