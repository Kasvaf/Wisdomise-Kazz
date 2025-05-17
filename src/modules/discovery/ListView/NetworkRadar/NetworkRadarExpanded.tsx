/* eslint-disable import/max-dependencies */
import { useMemo } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { bxsCopy, bxSort } from 'boxicons-quasar';
import { OverviewWidget } from 'shared/OverviewWidget';
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
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { usePageState } from 'shared/usePageState';
import { NCoinAge } from './NCoinAge';
import { NCoinTradingVolume } from './NCoinTradingVolume';
import { NCoinBuySell } from './NCoinBuySell';
import { NCoinLiquidity } from './NCoinLiquidity';
import { NCoinSecurity } from './NCoinSecurity';
import { NCoinRecentCandles } from './NCoinRecentCandles';
import { NetworkRadarFilters } from './NetworkRadarFilters';

export function NetworkRadarExpanded({ className }: { className?: string }) {
  const { t } = useTranslation('network-radar');
  const [copy, copyNotif] = useShare('copy');

  const [pageState, setPageState] = usePageState<
    Parameters<typeof useNetworkRadarNCoins>[0]
  >('network-radar', {});

  const nCoins = useNetworkRadarNCoins(pageState);
  useLoadingBadge(nCoins.isFetching);

  const columns = useMemo<Array<TableColumn<NetworkRadarNCoin>>>(
    () => [
      {
        title: '#',
        render: row => row._rank,
        width: 64,
      },
      {
        title: t('common.name'),
        sticky: 'start',
        width: 220,
        render: row => <Coin coin={row.base_symbol} />,
      },
      {
        title: t('common.address'),
        width: 180,
        render: row => (
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
        width: 95,
        render: row => (
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
        width: 185,
        render: row => (
          <NCoinLiquidity
            value={row}
            className="text-xs"
            imgClassName="size-5"
            type="update"
          />
        ),
      },
      {
        title: t('common.initial_liquidity'),
        width: 165,
        render: row => (
          <NCoinLiquidity value={row} className="text-xs" type="initial" />
        ),
      },
      {
        title: t('common.marketcap'),
        width: 64,
        render: row => (
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
        title: t('common.txns.title'),
        info: t('common.txns.info'),
        width: 110,
        render: row => (
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
        width: 110,
        render: row => (
          <NCoinTradingVolume
            value={row}
            imgClassName="size-4"
            className="w-20 text-xs"
          />
        ),
      },
      {
        title: t('common.validation_insights'),
        width: 280,
        render: row => (
          <NCoinSecurity
            value={row}
            className="shrink-0 text-xxs"
            imgClassName="size-4"
            type="row"
          />
        ),
      },
      {
        title: t('common.recent_candles.title'),
        info: t('common.recent_candles.info'),
        width: 210,
        render: row => (
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
        hidden: !isDebugMode,
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
    >
      <NetworkRadarFilters
        value={pageState}
        onChange={newPageState => setPageState(newPageState)}
        className="mb-4 w-full"
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
          dataSource={nCoins.data}
          rowKey={r => r.base_contract_address}
          scrollable
          loading={nCoins.isLoading}
        />
      </AccessShield>
      {copyNotif}
    </OverviewWidget>
  );
}
