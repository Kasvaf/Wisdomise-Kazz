/* eslint-disable import/max-dependencies */
import { useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { bxGridAlt, bxTransferAlt } from 'boxicons-quasar';
import { type SingleWhale, useWhaleDetails, type WhaleAssetLabel } from 'api';
import { Coin } from 'shared/Coin';
import { ReadableNumber } from 'shared/ReadableNumber';
import Table from 'shared/Table';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { AccessShield } from 'shared/AccessShield';
import { CoinMarketCap } from 'shared/CoinMarketCap';
import { ButtonSelect } from 'shared/v1-components/ButtonSelect';
import { Button } from 'shared/v1-components/Button';
import Icon from 'shared/Icon';
import { WhaleAssetBadge } from 'shared/WhaleAssetBadge';
import { CoinLabels } from 'shared/CoinLabels';
import { CoinPriceInfo } from 'shared/CoinPriceInfo';
import { type Coin as CoinType } from 'api/types/shared';

const HOLDING_LABELS: WhaleAssetLabel[] = [
  'dust',
  'stable',
  'holding',
] as const;

export function WhaleCoinsWidget({
  className,
  holderAddress,
  networkName,
  type,
  hr,
  onSelect,
}: {
  className?: string;
  holderAddress: string;
  networkName: string;
  type: 'trading' | 'holding';
  hr?: boolean;
  onSelect?: (coin: CoinType) => void;
}) {
  const { t } = useTranslation('whale');

  const [label, setLabel] = useState<WhaleAssetLabel | undefined>(undefined);
  const whale = useWhaleDetails({
    holderAddress,
    networkName,
  });

  const columns = useMemo<Array<ColumnType<SingleWhale['assets'][number]>>>(
    () => [
      {
        title: t('whale_coins.name'),
        fixed: 'left',
        render: (_, row) => <Coin coin={row.symbol} imageClassName="size-6" />,
      },
      {
        colSpan: type === 'trading' ? 1 : 0,
        title: t('whale_coins.avg_cost'),
        render: (_, row) => (
          <ReadableNumber value={row.recent_avg_cost} label="$" popup="never" />
        ),
      },
      {
        colSpan: type === 'holding' ? 1 : 0,
        title: t('whale_coins.info'),
        render: (_, row) => <CoinPriceInfo marketData={row.market_data} />,
      },
      {
        colSpan: type === 'trading' ? 1 : 0,
        title: t('whale_coins.badge'),
        render: (_, row) => <WhaleAssetBadge value={row.label} />,
      },
      {
        title: t('whale_coins.market_cap'),
        render: (_, row) => <CoinMarketCap marketData={row.market_data} />,
      },
      {
        colSpan: type === 'trading' ? 1 : 0,
        title: t('whale_coins.avg_sold'),
        render: (_, row) => (
          <ReadableNumber value={row.recent_avg_sold} label="$" popup="never" />
        ),
      },
      {
        title: t('whale_coins.total_profit'),
        render: (_, row) => (
          <div className="flex gap-1">
            <ReadableNumber
              value={row.total_profit_last_ndays}
              label="$"
              popup="never"
            />
            <DirectionalNumber
              value={row.total_profit_latst_ndays_percent}
              label="%"
              popup="never"
              showIcon={false}
              showSign
              className="text-xs"
            />
          </div>
        ),
      },
      {
        title: t('whale_coins.number_of_transactions'),
        render: (_, row) => (
          <ReadableNumber value={row.total_recent_transfers} popup="never" />
        ),
      },
      {
        title: t('whale_coins.balance'),
        render: (_, row) => (
          <ReadableNumber value={row.worth} label="$" popup="never" />
        ),
      },
      {
        colSpan: type === 'trading' ? 1 : 0,
        title: t('whale_coins.avg_sold'),
        render: (_, row) => (
          <ReadableNumber value={row.recent_avg_sold} label="$" popup="never" />
        ),
      },
      {
        colSpan: type === 'holding' ? 1 : 0,
        title: t('whale_coins.chg_30d'),
        render: (_, row) => (
          <DirectionalNumber
            value={row.last_30_days_price_change}
            label="%"
            popup="never"
          />
        ),
      },
      {
        title: t('whale_coins.labels'),
        className: 'min-h-16 min-w-72',
        render: (_, row) => (
          <CoinLabels
            categories={row.symbol.categories}
            labels={row.symbol_labels}
            networks={row.networks}
            security={row.security?.data}
            coin={row.symbol}
          />
        ),
      },
      {
        colSpan: typeof onSelect === 'function' ? 1 : 0,
        title: '',
        render: (_, row) => (
          <div className="flex items-center justify-end whitespace-nowrap">
            <Button
              size="xs"
              variant="outline"
              surface={4}
              onClick={() => onSelect?.(row.symbol)}
            >
              <Icon name={bxTransferAlt} />
              {t('whale_coins.view_transactions')}
            </Button>
          </div>
        ),
      },
    ],
    [onSelect, t, type],
  );

  const data =
    whale.data?.assets.filter(
      x =>
        x.label &&
        (type === 'holding'
          ? HOLDING_LABELS.includes(x.label)
          : !HOLDING_LABELS.includes(x.label)),
    ) ?? [];

  if (whale.isLoading || data?.length === 0) return null;

  return (
    <>
      <div className={className}>
        <h3 className="mb-4 text-sm font-semibold">
          {type === 'trading'
            ? t('whale_coins.trading_title')
            : t('whale_coins.holding_title')}
        </h3>
        <div className="mb-4 flex items-center gap-3">
          <Button
            variant={label ? 'ghost' : 'primary'}
            onClick={() => setLabel(undefined)}
            size="md"
            surface={2}
          >
            <Icon name={bxGridAlt} size={16} />
            {t('common:all')}
          </Button>
          <div className="h-4 w-px bg-white/10" />
          <ButtonSelect
            value={label}
            variant="primary"
            onChange={setLabel}
            size="md"
            surface={2}
            options={
              type === 'trading'
                ? [
                    {
                      label: 'Active Trade',
                      value: 'trading',
                    },
                    {
                      label: 'New Investments',
                      value: 'new_investment',
                    },
                    {
                      label: 'Exit Portfolios',
                      value: 'exit_portfolio',
                    },
                    {
                      label: 'Load',
                      value: 'loading',
                    },
                    {
                      label: 'Unload',
                      value: 'unloading',
                    },
                  ]
                : [
                    {
                      label: 'Holdings',
                      value: 'holding',
                    },
                    {
                      label: 'Stable Coins',
                      value: 'stable',
                    },
                    {
                      label: 'Low Worth Coins (Dusts)',
                      value: 'dust',
                    },
                  ]
            }
          />
        </div>
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
            dataSource={data.filter(row => label === row.label || !label)}
            rowKey={row => JSON.stringify(row.symbol)}
            loading={whale.isLoading}
          />
        </AccessShield>
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
