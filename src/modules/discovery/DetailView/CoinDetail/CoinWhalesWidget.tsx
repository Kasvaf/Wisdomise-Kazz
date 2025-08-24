import { type CoinWhale, useCoinWhales } from 'api/discovery';
import { bxSearch } from 'boxicons-quasar';

import { clsx } from 'clsx';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import Icon from 'shared/Icon';
import { Network } from 'shared/Network';
import { ReadableNumber } from 'shared/ReadableNumber';
import { Button } from 'shared/v1-components/Button';
import { Input } from 'shared/v1-components/Input';
import { Table, type TableColumn } from 'shared/v1-components/Table';
import { WhaleAssetBadge } from 'shared/WhaleAssetBadge';
import { Wallet } from '../WhaleDetail/Wallet';
import { useUnifiedCoinDetails } from './lib';

export function CoinWhalesWidget({
  type,
  title,
  id,
  limit: _limit = 6,
  hr,
  className,
}: {
  type: 'active' | 'holding';
  title?: boolean;
  limit?: number;
  id?: string;
  hr?: boolean;
  className?: string;
}) {
  const { t } = useTranslation('whale');
  const { symbol } = useUnifiedCoinDetails();
  const whales = useCoinWhales({ slug: symbol.slug, type });
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
            date={row.asset.last_label_action_datetime}
            value={row.asset.label}
          />
        ),
      },
      {
        title: t('whales_on_coin.network'),
        render: row => (
          <Network
            className="text-xs"
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
          <ReadableNumber
            className="text-xs"
            label="$"
            popup="never"
            value={row.asset.worth}
          />
        ),
      },
      {
        title: t('whales_on_coin.trading_vol'),
        render: row => (
          <ReadableNumber
            className="text-xs"
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
            className="text-xs"
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
            className="text-xs"
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

  const data = useMemo(() => {
    return whales.data?.filter(
      x => !query || x.holder_address.includes(query.toLowerCase()),
    );
  }, [query, whales.data]);

  if ((whales.data ?? []).length === 0) return null;

  return (
    <>
      <div
        className={clsx(
          'relative flex flex-col gap-4 overflow-auto overflow-x-hidden',
          className,
        )}
        id={id}
      >
        <div className="flex items-center justify-between gap-1">
          {title !== false && (
            <h3 className="font-semibold text-sm">
              {type === 'active'
                ? t('coin-radar:whales.active')
                : t('coin-radar:whales.holding')}
            </h3>
          )}
          <Input
            className="mobile:w-48 w-72"
            onChange={setQuery}
            placeholder={t('coin-radar:whales.search')}
            prefixIcon={<Icon name={bxSearch} />}
            size="xs"
            surface={1}
            type="string"
            value={query}
          />
        </div>
        <Table
          columns={columns}
          dataSource={data?.slice(0, limit) ?? []}
          footer={
            typeof limit === 'number' &&
            (data?.length ?? 0) > limit && (
              <Button
                onClick={() => setLimit(undefined)}
                size="xs"
                variant="link"
              >
                {t('common:load-more')}
              </Button>
            )
          }
          loading={whales.isLoading}
          rowKey={row => `${row.holder_address}${row.network_name ?? ''}`}
          scrollable
          surface={1}
        />
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
