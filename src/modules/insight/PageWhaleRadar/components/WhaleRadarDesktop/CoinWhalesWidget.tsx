import { type FC, useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { type CoinWhale, useCoinWhales } from 'api';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Wallet } from 'shared/Wallet';
import { WhaleAssetBadge } from 'shared/WhaleAssetBadge';
import { Network } from 'shared/Network';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import Table from 'shared/Table';
import { OverviewWidget } from 'shared/OverviewWidget';
import { Coin } from 'shared/Coin';
import { type Coin as CoinType } from 'api/types/shared';
import { AccessShield } from 'shared/AccessShield';

export const CoinWhalesWidget: FC<{
  id?: string;
  coin: CoinType;
  type: NonNullable<Parameters<typeof useCoinWhales>[0]['type']>;
  noEmptyState?: boolean;
}> = ({ id, coin, type, noEmptyState }) => {
  const { t } = useTranslation('whale');
  const whales = useCoinWhales({ slug: coin.slug ?? 'bitcoin', type });

  const columns = useMemo<Array<ColumnType<CoinWhale>>>(
    () => [
      {
        title: t('whales_on_coin.address'),
        render: (_, row) => (
          <Wallet
            wallet={{
              address: row.holder_address,
              network: row.network_name,
            }}
          />
        ),
      },
      {
        title: t('whales_on_coin.badge'),
        render: (_, row) => (
          <WhaleAssetBadge
            value={row.asset.label}
            date={row.asset.last_label_action_datetime}
          />
        ),
      },
      {
        title: t('whales_on_coin.network'),
        render: (_, row) => (
          <Network
            network={{
              name: row.network_name,
              icon_url: row.network_icon_url,
            }}
            imageClassName="size-4"
          />
        ),
      },
      {
        title: t('whales_on_coin.balance'),
        render: (_, row) => (
          <ReadableNumber value={row.asset.worth} label="$" popup="never" />
        ),
      },
      {
        title: t('whales_on_coin.trading_vol'),
        render: (_, row) => (
          <ReadableNumber
            value={
              (row.asset.total_recent_sell_amount ?? 0) +
              (row.asset.total_recent_buy_amount ?? 0)
            }
            label="$"
            popup="never"
          />
        ),
      },
      {
        title: t('whales_on_coin.total_pnl'),
        render: (_, row) => (
          <DirectionalNumber
            value={row.asset.pnl}
            direction="auto"
            showSign
            label="$"
            popup="never"
          />
        ),
      },
      {
        title: t('whales_on_coin.returns'),
        render: (_, row) => (
          <DirectionalNumber
            value={row.asset.pnl_percent}
            direction="auto"
            showSign
            label="%"
            popup="never"
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
      id={id}
      title={
        <>
          {type === 'active'
            ? t('whales_on_coin.active_title')
            : t('whales_on_coin.holding_title')}
          <Coin coin={coin} truncate={299} imageClassName="size-6" mini />
        </>
      }
      subtitle={t('whales_on_coin.description')}
      empty={{
        enabled: isEmpty,
        refreshButton: false,
        title:
          type === 'active'
            ? t('whales_on_coin.active_empty')
            : t('whales_on_coin.holding_empty'),
        subtitle: t('whales_on_coin.empty_subtitle'),
      }}
      loading={whales.isLoading}
    >
      <AccessShield
        mode="table"
        sizes={{
          'guest': true,
          'initial': 3,
          'free': 3,
          'pro': 3,
          'pro+': 3,
          'pro_max': false,
        }}
      >
        <Table
          columns={columns}
          dataSource={whales.data ?? []}
          rowKey={r => r.holder_address}
          pagination={{
            pageSize: 5,
          }}
        />
      </AccessShield>
    </OverviewWidget>
  );
};
