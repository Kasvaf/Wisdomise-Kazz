/* eslint-disable import/max-dependencies */
import { useMemo } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { type TableColumnType } from 'antd';
import { bxsCopy, bxSort } from 'boxicons-quasar';
import { OverviewWidget } from 'shared/OverviewWidget';
import Table, { useTableState } from 'shared/Table';
import { Coin } from 'shared/Coin';
import { AccessShield } from 'shared/AccessShield';

import {
  type NetworkRadarNCoin,
  useNetworkRadarNCoins,
} from 'api/insight/network';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { isDebugMode } from 'utils/version';
import { useShare } from 'shared/useShare';
import { shortenAddress } from 'utils/shortenAddress';
import { useLoadingBadge } from 'shared/LoadingBadge';
import { NCoinAge } from '../NCoinAge';
import { NCoinTradingVolume } from '../NCoinTradingVolume';
import { NCoinBuySell } from '../NCoinBuySell';
import { NCoinLiquidity } from '../NCoinLiquidity';
import { NCoinSecurity } from '../NCoinSecurity';
import { NCoinRecentCandles } from '../NCoinRecentCandles';

export function NetworkRadarDesktop({ className }: { className?: string }) {
  const { t } = useTranslation('network-radar');
  const [copy, copyNotif] = useShare('copy');
  const [tableProps, tableState] = useTableState<
    Required<Parameters<typeof useNetworkRadarNCoins>[0]>
  >('', {
    page: 1,
    pageSize: 20,
    networks: [],
  });

  const nCoins = useNetworkRadarNCoins(tableState);
  useLoadingBadge(nCoins.isFetching);

  const columns = useMemo<Array<TableColumnType<NetworkRadarNCoin>>>(
    () => [
      {
        title: '#',
        render: (_, row) => row._rank,
        fixed: 'left',
        className: 'w-14 max-w-24',
      },
      {
        title: t('common.name'),
        fixed: 'left',
        className: 'w-44 max-w-44',
        render: (_, row) => <Coin coin={row.base_symbol} nonLink={true} />,
      },
      {
        title: t('common.address'),
        className: 'w-44 max-w-44',
        render: (_, row) => (
          <>
            <div className="flex items-center gap-1">
              {shortenAddress(row.base_contract_address)}
              <Icon
                name={bxsCopy}
                size={14}
                className="cursor-pointer text-v1-content-secondary"
                onClick={() => copy(row.base_contract_address)}
              />
            </div>
          </>
        ),
      },
      {
        title: t('common.created'),
        render: (_, row) => (
          <NCoinAge
            value={row.creation_datetime}
            imgClassName="size-4 opacity-75"
            className="w-14 text-xs"
            inline
          />
        ),
      },
      {
        title: t('common.liquidity'),
        render: (_, row) => (
          <NCoinLiquidity
            value={row}
            className="w-36 text-xs"
            imgClassName="size-5"
            type="update"
          />
        ),
      },
      {
        title: t('common.initial_liquidity'),
        render: (_, row) => (
          <NCoinLiquidity value={row} className="w-36 text-xs" type="initial" />
        ),
      },
      {
        title: t('common.marketcap'),
        render: (_, row) => (
          <ReadableNumber
            value={row.update.base_market_data.market_cap}
            className="w-20 text-xs"
            label="$"
            format={{
              decimalLength: 1,
            }}
          />
        ),
      },
      {
        title: [t('common.txns.title'), t('common.txns.info')],
        render: (_, row) => (
          <NCoinBuySell
            value={{
              buys: row.update.total_num_buys,
              sells: row.update.total_num_sells,
            }}
            imgClassName="size-3"
            className="w-20 text-xs"
          />
        ),
      },
      {
        title: t('common.volume'),
        render: (_, row) => (
          <NCoinTradingVolume
            value={row}
            imgClassName="size-4"
            className="w-20 text-xs"
          />
        ),
      },
      {
        title: t('common.validation_insights'),
        render: (_, row) => (
          <NCoinSecurity
            value={row}
            className="shrink-0 text-xxs"
            imgClassName="size-4"
            type="row"
          />
        ),
      },
      {
        title: [
          t('common.recent_candles.title'),
          t('common.recent_candles.info'),
        ],
        render: (_, row) => (
          <NCoinRecentCandles
            value={row}
            height={50}
            width={65}
            renderer="canvas"
          />
        ),
      },
      /* TODO: @arash16 Buy/Sell Button in Desktop */
      {
        title: '',
        colSpan: isDebugMode ? 1 : 0,
        fixed: 'right',
        render: () => (
          <Button
            fab
            size="sm"
            variant="ghost"
            surface={4}
            onClick={() =>
              alert(
                'This button is only shown in debug mode and serves as a placeholder/showcase. The action will be handled in the future.',
              )
            }
          >
            <Icon name={bxSort} size={12} className="rotate-90" />
          </Button>
        ),
      },
    ],
    [copy, t],
  );

  return (
    <OverviewWidget
      className={clsx(
        'min-h-[670px] shrink-0 xl:min-h-[631px] 2xl:min-h-[640px]',
        className,
      )}
      title={t('page.title')}
      info={t('page.info')}
      loading={nCoins.isLoading}
      empty={nCoins.data?.length === 0}
    >
      <AccessShield
        mode="table"
        sizes={{
          'guest': true,
          'initial': 3,
          'free': 3,
          'pro': false,
          'pro+': false,
          'pro_max': false,
        }}
      >
        <Table
          columns={columns}
          dataSource={nCoins.data}
          rowKey={r => JSON.stringify(r.base_symbol)}
          tableLayout="fixed"
          {...tableProps}
        />
      </AccessShield>
      {copyNotif}
    </OverviewWidget>
  );
}
