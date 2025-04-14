import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { clsx } from 'clsx';
import { bxSearch } from 'boxicons-quasar';
import { type CoinWhale, useCoinWhales } from 'api';
import Table from 'shared/Table';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Wallet } from 'shared/Wallet';
import { Network } from 'shared/Network';
import Icon from 'shared/Icon';
import { Input } from 'shared/v1-components/Input';
import { WhaleAssetBadge } from 'shared/WhaleAssetBadge';
import { DirectionalNumber } from 'shared/DirectionalNumber';

function CoinWhalesWidgetWithType({
  type,
  slug,
  id,
  hr,
  className,
}: {
  type: 'active' | 'holding';
  slug: string;
  id?: string;
  hr?: boolean;
  className?: string;
}) {
  const { t } = useTranslation('whale');
  const whales = useCoinWhales({ slug, type });
  const [query, setQuery] = useState('');

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
            className="text-xs"
          />
        ),
      },
      {
        title: t('whales_on_coin.balance'),
        render: (_, row) => (
          <ReadableNumber
            value={row.asset.worth}
            label="$"
            popup="never"
            className="text-xs"
          />
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
            className="text-xs"
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
            className="text-xs"
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
            className="text-xs"
          />
        ),
      },
    ],
    [t],
  );

  const data = useMemo(() => {
    return whales.data?.filter(
      x => !query || x.holder_address.includes(query.toLowerCase()),
    );
  }, [query, whales.data]);

  if ((whales.data ?? []).length === 0 && !whales.isLoading) return null;

  return (
    <>
      <div
        id={id}
        className={clsx(
          'relative flex flex-col gap-4 overflow-auto overflow-x-hidden',
          className,
        )}
      >
        <div className="flex items-center justify-between gap-1">
          <h3 className="text-sm font-semibold">
            {type === 'active'
              ? t('coin-radar:whales.active')
              : t('coin-radar:whales.holding')}
          </h3>
          <Input
            type="string"
            size="md"
            value={query}
            onChange={setQuery}
            className="mb-4 w-72 text-sm mobile:w-full"
            prefixIcon={<Icon name={bxSearch} />}
            placeholder={t('coin-radar:whales.search')}
            surface={2}
          />
        </div>
        <Table
          loading={whales.isLoading}
          columns={columns}
          dataSource={data ?? []}
          rowKey={row => `${row.holder_address}${row.network_name ?? ''}`}
          tableLayout="auto"
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
          }}
          surface={1}
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}

export function CoinWhalesWidget({
  slug,
  id,
  hr,
  className,
}: {
  slug: string;
  id?: string;
  hr?: boolean;
  className?: string;
}) {
  return (
    <>
      <CoinWhalesWidgetWithType
        slug={slug}
        type="active"
        id={id}
        hr={hr}
        className={className}
      />
      <CoinWhalesWidgetWithType
        slug={slug}
        type="holding"
        id={id}
        hr={hr}
        className={className}
      />
    </>
  );
}
