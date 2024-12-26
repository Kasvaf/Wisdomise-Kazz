import { useMemo } from 'react';
import { type ColumnType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { type SingleWhale, useWhaleDetails } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { Coin } from 'shared/Coin';
import { ReadableNumber } from 'shared/ReadableNumber';
import Table from 'shared/Table';
import { DirectionalNumber } from 'shared/DirectionalNumber';
import { AccessShield } from 'shared/AccessShield';
import { WhaleAssetBadge } from 'shared/WhaleAssetBadge';

export function WhaleHoldsWidget({
  className,
  holderAddress,
  networkName,
}: {
  className?: string;
  holderAddress: string;
  networkName: string;
}) {
  const { t } = useTranslation('whale');
  const whale = useWhaleDetails({
    holderAddress,
    networkName,
  });

  const columns = useMemo<
    Array<ColumnType<SingleWhale['holding_assets'][number]>>
  >(
    () => [
      {
        title: t('whale_holds.name'),
        fixed: 'left',
        render: (_, row) => <Coin coin={row.symbol} imageClassName="size-6" />,
      },
      {
        title: [
          t('whale_holds.badge'),
          <div className="p-1 text-xxs" key="tooltip">
            <b className="block pb-1">{t('asset_badges.holding')}</b>
            <p className="pb-3 text-v1-content-secondary">
              {t('asset_badges.holding_info')}
            </p>
            <b className="block pb-1">{t('asset_badges.unloading')}</b>
            <p className="pb-3 text-v1-content-secondary">
              {t('asset_badges.unloading_info')}
            </p>
            <b className="block pb-1">{t('asset_badges.loading')}</b>
            <p className="pb-3 text-v1-content-secondary">
              {t('asset_badges.loading_info')}
            </p>
            <b className="block pb-1">{t('asset_badges.new_investment')}</b>
            <p className="pb-3 text-v1-content-secondary">
              {t('asset_badges.new_investment_info')}
            </p>
            <b className="block pb-1">{t('asset_badges.exit_portfolio')}</b>
            <p className="pb-3 text-v1-content-secondary">
              {t('asset_badges.exit_portfolio_info')}
            </p>
            <b className="block pb-1">{t('asset_badges.dust')}</b>
            <p className="text-v1-content-secondary">
              {t('asset_badges.dust_info')}
            </p>
          </div>,
        ],
        render: (_, row) => <WhaleAssetBadge value={row.label} />,
      },
      {
        title: t('whale_holds.market_cap'),
        render: (_, row) => (
          <ReadableNumber
            value={row.market_data.market_cap}
            label="$"
            popup="never"
          />
        ),
      },
      {
        title: t('whale_holds.total_volume'),
        render: (_, row) => (
          <ReadableNumber
            value={row.market_data.total_volume}
            label="$"
            popup="never"
          />
        ),
      },
      {
        title: t('whale_holds.worth'),
        render: (_, row) => (
          <ReadableNumber value={row.worth} label="$" popup="never" />
        ),
      },
      {
        title: t('whale_holds.price'),
        render: (_, row) => (
          <ReadableNumber value={row.market_data.current_price} label="$" />
        ),
      },
      {
        title: t('whale_holds.chg_30d'),
        render: (_, row) => (
          <DirectionalNumber
            value={row.last_30_days_price_change}
            showIcon
            showSign
            label="%"
          />
        ),
      },
    ],
    [t],
  );

  return (
    <OverviewWidget
      className={className}
      title={t('whale_holds.title')}
      loading={whale.isLoading}
      empty={whale.data?.holding_assets?.length === 0}
    >
      <AccessShield
        mode="table"
        sizes={{
          'guest': true,
          'trial': true,
          'free': true,
          'pro': true,
          'pro+': false,
        }}
      >
        <Table
          columns={columns}
          dataSource={whale.data?.holding_assets ?? []}
          rowKey={row => JSON.stringify(row.symbol)}
          loading={whale.isLoading}
        />
      </AccessShield>
    </OverviewWidget>
  );
}
