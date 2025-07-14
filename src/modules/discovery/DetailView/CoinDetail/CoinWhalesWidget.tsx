import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';

import { clsx } from 'clsx';
import { bxSearch } from 'boxicons-quasar';
import { type CoinWhale, useCoinWhales } from 'api/discovery';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Network } from 'shared/Network';
import Icon from 'shared/Icon';
import { Input } from 'shared/v1-components/Input';
import { WhaleAssetBadge } from 'shared/WhaleAssetBadge';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { Button } from 'shared/v1-components/Button';
import { Wallet } from '../WhaleDetail/Wallet';

export function CoinWhalesWidget({
  type,
  slug,
  title,
  id,
  limit: _limit = 6,
  hr,
  className,
}: {
  type: 'active' | 'holding';
  title?: boolean;
  slug: string;
  limit?: number;
  id?: string;
  hr?: boolean;
  className?: string;
}) {
  const { t } = useTranslation('whale');
  const whales = useCoinWhales({ slug, type });
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState<number | undefined>(_limit);

  const columns = useMemo<Array<TableColumn<CoinWhale>>>(
    () => [
      {
        title: t('whales_on_coin.address'),
        sticky: 'start',
        render: row => (
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
        render: row => (
          <WhaleAssetBadge
            value={row.asset.label}
            date={row.asset.last_label_action_datetime}
          />
        ),
      },
      {
        title: t('whales_on_coin.network'),
        render: row => (
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
        render: row => (
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
        render: row => (
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
        render: row => (
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
        render: row => (
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

  if ((whales.data ?? []).length === 0) return null;

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
          {title !== false && (
            <h3 className="text-sm font-semibold">
              {type === 'active'
                ? t('coin-radar:whales.active')
                : t('coin-radar:whales.holding')}
            </h3>
          )}
          <Input
            type="string"
            size="xs"
            value={query}
            onChange={setQuery}
            className="w-72 mobile:w-48"
            prefixIcon={<Icon name={bxSearch} />}
            placeholder={t('coin-radar:whales.search')}
            surface={2}
          />
        </div>
        <Table
          loading={whales.isLoading}
          columns={columns}
          dataSource={data?.slice(0, limit) ?? []}
          rowKey={row => `${row.holder_address}${row.network_name ?? ''}`}
          surface={2}
          scrollable
          footer={
            typeof limit === 'number' &&
            (data?.length ?? 0) > limit && (
              <Button
                size="xs"
                onClick={() => setLimit(undefined)}
                variant="link"
              >
                {t('common:load-more')}
              </Button>
            )
          }
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
