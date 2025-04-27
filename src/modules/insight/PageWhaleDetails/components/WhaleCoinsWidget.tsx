/* eslint-disable import/max-dependencies */
import { useMemo, useState } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { bxDotsHorizontalRounded, bxGridAlt } from 'boxicons-quasar';
import { Tooltip } from 'antd';
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
import useIsMobile from 'utils/useIsMobile';
import { Checkbox } from 'shared/v1-components/Checkbox';

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
  const isMobile = useIsMobile();
  const { t } = useTranslation('whale');
  const [hoveredRow, setHoveredRow] = useState<number>();
  const [label, setLabel] = useState<WhaleAssetLabel | undefined>(undefined);
  const [showDusts, setShowDusts] = useState(false);
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
        render: (_, row) => row.label ?? '---',
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
        title: t('whale_coins.remaining'),
        render: (_, row) => (
          <ReadableNumber
            value={row.remaining_percent}
            label="%"
            popup="never"
          />
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
        colSpan: typeof onSelect === 'function' && !isMobile ? 1 : 0,
        fixed: 'right',
        width: 1,
        render: (_, row, index) => (
          <Tooltip
            open={index === hoveredRow && typeof onSelect === 'function'}
            rootClassName="[&_.ant-tooltip-arrow]:!hidden [&_.ant-tooltip-inner]:!bg-transparent [&_.ant-tooltip-inner]:!p-0"
            placement="top"
            title={
              <Button
                className="absolute -bottom-7 -right-2 mobile:right-8"
                variant="primary"
                size="xs"
                fab
                onClick={async () => {
                  onSelect?.(row.symbol);
                }}
              >
                <Icon
                  name={bxDotsHorizontalRounded}
                  size={6}
                  strokeWidth={0.4}
                />
              </Button>
            }
          />
        ),
      },
    ],
    [hoveredRow, isMobile, onSelect, t, type],
  );

  const data =
    whale.data?.assets.filter(
      x =>
        x.label &&
        (type === 'holding'
          ? HOLDING_LABELS.includes(x.label)
          : !HOLDING_LABELS.includes(x.label)),
    ) ?? [];

  const filteredData = data.filter(row => {
    if (type === 'holding' && !showDusts && row.label === 'dust') return false;

    return !label || label === row.label;
  });

  if (whale.isLoading || data?.length === 0) return null;

  return (
    <>
      <div className={className}>
        <h3 className="mb-4 text-sm font-semibold">
          {type === 'trading'
            ? t('whale_coins.trading_title')
            : t('whale_coins.holding_title')}
        </h3>
        <div className="mb-4 flex max-w-full items-center gap-2 overflow-auto">
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
          <div className="flex w-full items-center justify-between gap-2">
            <ButtonSelect
              value={label}
              variant="primary"
              onChange={setLabel}
              size="md"
              surface={2}
              innerScroll={false}
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
                    ]
              }
            />
            {type === 'holding' && (
              <Checkbox
                value={showDusts}
                onChange={setShowDusts}
                label="Show Low Worth Coins (Dusts)"
                size="lg"
                className="whitespace-nowrap"
                block
              />
            )}
          </div>
        </div>
        {filteredData.length === 0 ? (
          <p className="p-3 text-center text-sm text-v1-content-secondary">
            {t('common:nothing-to-show')}
          </p>
        ) : (
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
              dataSource={filteredData}
              rowKey={row => JSON.stringify(row.symbol)}
              loading={whale.isLoading}
              onRow={(_, index) => ({
                onMouseEnter: () => setHoveredRow(index),
                onMouseLeave: () => setHoveredRow(undefined),
              })}
            />
          </AccessShield>
        )}
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
