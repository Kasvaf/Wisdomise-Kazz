/* eslint-disable import/max-dependencies */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';
import { MobileTable, type MobileTableColumn } from 'shared/MobileTable';
import {
  type NetworkRadarNCoin,
  useNetworkRadarNCoins,
} from 'api/insight/network';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { NCoinAge } from '../NCoinAge';
import { NCoinBuySell } from '../NCoinBuySell';
import { NCoinTradingVolume } from '../NCoinTradingVolume';
import { NCoinLiquidity } from '../NCoinLiquidity';
import { NCoinSecurity } from '../NCoinSecurity';
import { NCoinPreDetailModal } from '../NCoinPreDetailModal';

export const NetworkRadarMobile = () => {
  const { t } = useTranslation('network-radar');
  const [, tableState] = useTableState<
    Required<Parameters<typeof useNetworkRadarNCoins>[0]>
  >('', {
    page: 1,
    pageSize: 10,
    networks: [],
  });

  const [selectedRow, setSelectedRow] = useState<null | NetworkRadarNCoin>(
    null,
  );
  const [modal, setModal] = useState(false);

  const nCoins = useNetworkRadarNCoins(tableState);
  useLoadingBadge(nCoins.isFetching);

  const columns = useMemo<Array<MobileTableColumn<NetworkRadarNCoin>>>(
    () => [
      {
        key: 'rank',
        className: 'max-w-10 min-w-2 text-start text-xs font-medium',
        render: row => row._rank,
      },
      {
        key: 'coin',
        render: row => (
          <Coin
            coin={row.base_symbol}
            imageClassName="size-7"
            className="text-xs"
            truncate={50}
            nonLink={true}
          />
        ),
      },
      {
        key: 'age',
        className: 'max-w-12 min-w-8',
        render: row => (
          <NCoinAge
            value={row.creation_datetime}
            imgClassName="size-3"
            className="h-[25px] text-xxs"
          />
        ),
      },
      {
        key: 'market_data',
        className: 'max-w-20',
        render: row => (
          <div className="flex h-[25px] flex-col justify-between">
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
        className: 'max-w-22',
        render: row => (
          <NCoinLiquidity
            value={row}
            className="text-xxs"
            imgClassName="size-6"
            type="update_with_icon"
          />
        ),
      },
      {
        key: 'security',
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

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-sm">{t('page.title')}</h1>
      </div>
      <AccessShield
        mode="mobile_table"
        sizes={{
          guest: false,
          initial: false,
          free: false,
          vip: false,
        }}
      >
        <MobileTable
          columns={columns}
          dataSource={nCoins.data ?? []}
          rowKey={r => JSON.stringify(r.base_symbol.slug)}
          loading={nCoins.isLoading}
          surface={2}
          onClick={r => {
            setSelectedRow(r);
            setModal(true);
          }}
        />
      </AccessShield>
      <NCoinPreDetailModal
        value={selectedRow}
        open={modal}
        onClose={() => setModal(false)}
      />
    </>
  );
};
