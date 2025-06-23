/* eslint-disable import/max-dependencies */
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { type NetworkRadarNCoin, useNetworkRadarNCoins } from 'api/discovery';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { usePageState } from 'shared/usePageState';
import { useCoinPreDetailModal } from '../CoinPreDetailModal';
import { NCoinAge } from './NCoinAge';
import { NCoinBuySell } from './NCoinBuySell';
import { NCoinTradingVolume } from './NCoinTradingVolume';
import { NCoinLiquidity } from './NCoinLiquidity';
import { NCoinSecurity } from './NCoinSecurity';
import { NCoinPreDetailModal } from './NCoinPreDetailModal';
import { NetworkRadarFilters } from './NetworkRadarFilters';

export const NetworkRadarCompact: FC<{ focus?: boolean }> = ({ focus }) => {
  const { t } = useTranslation('network-radar');

  const [openModal, { closeModal, isModalOpen, selectedRow }] =
    useCoinPreDetailModal<NetworkRadarNCoin>({
      directNavigate: !focus,
      slug: r => r.base_symbol.slug,
    });

  const [pageState, setPageState] = usePageState<
    Parameters<typeof useNetworkRadarNCoins>[0]
  >('network-radar', {});

  const nCoins = useNetworkRadarNCoins(pageState);
  useLoadingBadge(nCoins.isFetching);

  const columns = useMemo<Array<TableColumn<NetworkRadarNCoin>>>(
    () => [
      {
        key: 'coin',
        render: row => (
          <Coin
            coin={row.base_symbol}
            imageClassName="size-7"
            className="text-xs"
            truncate={45}
            nonLink={true}
          />
        ),
      },
      {
        key: 'age',
        render: row => (
          <NCoinAge
            value={row.creation_datetime}
            imgClassName="size-3"
            className="mt-[3px] text-xxs"
          />
        ),
      },
      {
        key: 'market_data',
        render: row => (
          <div className="flex flex-col justify-between">
            <NCoinTradingVolume
              value={row}
              imgClassName="size-3"
              className="text-xxs"
            />
            <NCoinBuySell
              value={{
                buys: row.update.total_num_buys,
                sells: row.update.total_num_sells,
              }}
              imgClassName="size-3"
              className="text-[8px]"
            />
          </div>
        ),
      },
      {
        key: 'liquidity',
        // className: 'max-w-22',
        render: row => (
          <NCoinLiquidity
            value={row}
            className="h-6 text-xxs"
            imgClassName="size-6"
            type="update_with_icon"
          />
        ),
      },
      {
        key: 'security',
        align: 'end',
        render: row => (
          <NCoinSecurity
            value={row}
            className="w-max shrink-0 text-xxs"
            imgClassName="!size-[12px]"
            type="grid"
          />
        ),
      },
    ],
    [],
  );

  const [searchParams] = useSearchParams();
  const activeSlug = searchParams.get('slug');

  return (
    <>
      {focus && (
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-sm">{t('page.title')}</h1>
        </div>
      )}
      <NetworkRadarFilters
        value={pageState}
        onChange={newPageState => setPageState(newPageState)}
        className="mb-4 w-full"
        surface={1}
        mini
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
          dataSource={nCoins.data ?? []}
          rowKey={r => r.base_contract_address}
          loading={nCoins.isLoading}
          surface={2}
          scrollable={false}
          onClick={r => openModal(r)}
          isActive={r => r.base_symbol.slug === activeSlug}
        />
      </AccessShield>
      <NCoinPreDetailModal
        value={selectedRow}
        open={isModalOpen}
        onClose={() => closeModal()}
      />
    </>
  );
};
