import { type CoinWhale, useCoinWhales } from 'api/discovery';
import type { Coin as CoinType } from 'api/types/shared';
import { Wallet } from 'modules/discovery/DetailView/WhaleDetail/Wallet';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessShield } from 'shared/AccessShield';
import { Coin } from 'shared/Coin';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { Network } from 'shared/Network';
import { OverviewWidget } from 'shared/OverviewWidget';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { WhaleAssetBadge } from 'shared/WhaleAssetBadge';

export const CoinWhalesWidget: FC<{
  id?: string;
  coin: CoinType;
  type: NonNullable<Parameters<typeof useCoinWhales>[0]['type']>;
  noEmptyState?: boolean;
}> = ({ id, coin, type, noEmptyState }) => {
  const { t } = useTranslation('whale');
  const whales = useCoinWhales({ slug: coin.slug ?? 'bitcoin', type });

  const columns = useMemo<Array<TableColumn<CoinWhale>>>(
    () => [
      {
        title: t('whales_on_coin.address'),
        render: row => (
          <Wallet
            wallet={{
              address: row.holder_address,
              network: row.network_name,
            }}
            whale
          />
        ),
      },
      {
        title: t('whales_on_coin.badge'),
        render: row => (
          <WhaleAssetBadge
            date={row.asset.last_label_action_datetime}
            value={row.asset.label}
          />
        ),
      },
      {
        title: t('whales_on_coin.network'),
        render: row => (
          <Network
            imageClassName="size-4"
            network={{
              name: row.network_name,
              icon_url: row.network_icon_url,
            }}
          />
        ),
      },
      {
        title: t('whales_on_coin.balance'),
        render: row => (
          <ReadableNumber label="$" popup="never" value={row.asset.worth} />
        ),
      },
      {
        title: t('whales_on_coin.trading_vol'),
        render: row => (
          <ReadableNumber
            label="$"
            popup="never"
            value={
              (row.asset.total_recent_sell_amount ?? 0) +
              (row.asset.total_recent_buy_amount ?? 0)
            }
          />
        ),
      },
      {
        title: t('whales_on_coin.total_pnl'),
        render: row => (
          <DirectionalNumber
            direction="auto"
            label="$"
            popup="never"
            showSign
            value={row.asset.pnl}
          />
        ),
      },
      {
        title: t('whales_on_coin.returns'),
        render: row => (
          <DirectionalNumber
            direction="auto"
            label="%"
            popup="never"
            showSign
            value={row.asset.pnl_percent}
          />
        ),
      },
    ],
    [t],
  );

  const isEmpty = whales.data?.length === 0;

  if (isEmpty && noEmptyState) return null;

  return (
    <OverviewWidget
      className="max-h-[400px]"
      empty={{
        enabled: isEmpty,
        refreshButton: false,
        title:
          type === 'active'
            ? t('whales_on_coin.active_empty')
            : t('whales_on_coin.holding_empty'),
        subtitle: t('whales_on_coin.empty_subtitle'),
      }}
      id={id}
      subtitle={t('whales_on_coin.description')}
      title={
        <>
          {type === 'active'
            ? t('whales_on_coin.active_title')
            : t('whales_on_coin.holding_title')}
          <Coin coin={coin} imageClassName="size-6" mini truncate={299} />
        </>
      }
    >
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
          dataSource={whales.data ?? []}
          loading={whales.isLoading}
          rowKey={r => r.holder_address}
        />
      </AccessShield>
    </OverviewWidget>
  );
};
