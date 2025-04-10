/* eslint-disable import/max-dependencies */
import { useMemo, type FC, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { Trans, useTranslation } from 'react-i18next';
import { bxShareAlt } from 'boxicons-quasar';
import { Tooltip } from 'antd';
import { type TechnicalRadarCoin, useTechnicalRadarCoins } from 'api';
import { AccessShield } from 'shared/AccessShield';
import Table, { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { CoinPriceInfo } from 'shared/CoinPriceInfo';
import { CoinLabels } from 'shared/CoinLabels';
import TechnicalRadarSharingModal from 'modules/insight/PageTechnicalRadar/components/TechnicalRadarSharingModal';
import Icon from 'shared/Icon';
import { Button } from 'shared/v1-components/Button';
import { useLoadingBadge } from 'shared/LoadingBadge';
import useEnsureAuthenticated from 'shared/useEnsureAuthenticated';
import { ConfirmationBadgesInfo } from '../../ConfirmationWidget/ConfirmationBadge/ConfirmationBadgesInfo';
import { TechnicalRadarSentiment } from '../../TechnicalRadarSentiment';
import { TechnicalRadarFilters } from '../../TechnicalRadarFilters';
import { ReactComponent as Logo } from './logo.svg';

export const TechnicalRadarCoinsTable: FC = () => {
  const { t } = useTranslation('market-pulse');
  const [tableProps, tableState, setTableState] = useTableState<
    Parameters<typeof useTechnicalRadarCoins>[0]
  >('overviewTable', {
    page: 1,
    pageSize: 10,
    sortBy: 'rank',
    sortOrder: 'ascending',
    query: '',
    networks: [],
    categories: [],
  });
  const coins = useTechnicalRadarCoins(tableState);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number>();
  const [selectedRow, setSelectedRow] = useState<TechnicalRadarCoin>();
  const [LoginModal, ensureAuthenticated] = useEnsureAuthenticated();

  const columns = useMemo<Array<ColumnType<TechnicalRadarCoin>>>(
    () => [
      {
        fixed: 'left',
        title: t('table.rank'),
        render: (_, row, index) => (
          <div>
            {row.rank}
            <Tooltip
              open={index === hoveredRow}
              rootClassName="[&_.ant-tooltip-arrow]:!hidden [&_.ant-tooltip-inner]:!bg-transparent"
              placement="left"
              title={
                <Button
                  className="-mr-1 !px-1"
                  variant="secondary"
                  size="xs"
                  onClick={async () => {
                    setHoveredRow(undefined);
                    const isLoggedIn = await ensureAuthenticated();
                    if (isLoggedIn) {
                      setSelectedRow(row);
                      setOpenShareModal(true);
                    }
                  }}
                >
                  <Icon name={bxShareAlt} size={6} />
                </Button>
              }
            />
          </div>
        ),
        width: 50,
      },
      {
        title: t('table.name'),
        render: (_, row) => <Coin coin={row.symbol} />,
        width: 200,
      },
      {
        title: [
          <span
            key="1"
            className="flex items-center gap-1 text-v1-content-primary"
          >
            <Logo className="inline-block size-4 grayscale" />
            {t('table.technical_sentiment.title')}
          </span>,
          <ConfirmationBadgesInfo key="2" />,
        ],
        width: 310,
        render: (_, row) => (
          <TechnicalRadarSentiment mode="default" value={row} />
        ),
      },
      {
        title: [t('table.market_cap.title'), t('table.market_cap.info')],
        width: 140,
        render: (_, row) => (
          <>{row.data && <CoinMarketCap marketData={row.data} />}</>
        ),
      },
      {
        title: [
          t('table.price_info.title'),
          <div
            key="2"
            className="[&_b]:font-medium [&_p]:text-xs [&_p]:text-v1-content-secondary"
          >
            <Trans i18nKey="table.price_info.info" ns="market-pulse" />
          </div>,
        ],
        width: 240,
        render: (_, row) => (
          <>{row.data && <CoinPriceInfo marketData={row.data} />}</>
        ),
      },
      {
        title: t('table.labels'),
        className: 'min-h-16 min-w-72',
        render: (_, row) => (
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
    [ensureAuthenticated, hoveredRow, t],
  );

  useLoadingBadge(coins.isFetching);

  return (
    <div>
      <TechnicalRadarFilters
        value={tableState}
        onChange={newState => setTableState(newState)}
        className="mb-4 w-full"
        surface={3}
      />

      <AccessShield
        mode="table"
        sizes={{
          'guest': true,
          'initial': 3,
          'free': 3,
          'pro': 3,
          'pro+': false,
          'pro_max': false,
        }}
      >
        <Table
          columns={columns}
          dataSource={coins.data}
          rowKey={r => JSON.stringify(r.symbol)}
          loading={coins.isLoading}
          tableLayout="fixed"
          onRow={(_, index) => ({
            onMouseEnter: () => setHoveredRow(index),
            onMouseLeave: () => setHoveredRow(undefined),
          })}
          {...tableProps}
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
