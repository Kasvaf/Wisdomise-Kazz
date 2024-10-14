import { clsx } from 'clsx';
import { useMemo } from 'react';
import { type TreemapConfig } from '@ant-design/plots/es/components/treemap';
import { Treemap } from '@ant-design/plots';
import { useTranslation } from 'react-i18next';
import { useWhaleDetails } from 'api';
import { OverviewWidget } from 'shared/OverviewWidget';
import { formatNumber } from 'utils/numbers';

export function WhaleAssetsTreeMapWidget({
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

  const config = useMemo<TreemapConfig>(() => {
    const assets = [
      ...(whale.data?.holding_assets ?? []),
      ...(whale.data?.trading_assets ?? []),
    ].filter(
      (row, index, self) =>
        self.findIndex(
          subRow =>
            JSON.stringify(subRow.symbol) === JSON.stringify(row.symbol),
        ) === index && row.market_data.id,
    );
    return {
      data: {
        name: 'root',
        children: assets.map(row => ({
          name: row.market_data.id,
          value: row.worth,
        })),
      },
      rectStyle: row => {
        const asset = assets.find(item => item.market_data.id === row.name);
        if (!asset) return {};
        return {
          fill:
            (asset.market_data.price_change_percentage_24h ?? 0) >= 0
              ? '#66FFC8'
              : '#F78C9A',
          stroke: '#1e1f24',
          lineWidth: 1.5,
        };
      },
      label: {
        autoRotate: true,
        content: row => {
          const name = row.name;
          if (!name) return '?';
          const asset = assets.find(item => item.market_data.id === name);
          if (!asset) return '?';
          return `${asset.symbol_abbreviation}\n${formatNumber(
            asset.worth ?? 0,
            {
              compactInteger: true,
              decimalLength: 1,
              minifyDecimalRepeats: true,
              seperateByComma: true,
            },
          )} USDT`;
        },
        style: {
          fill: 'rgba(0, 0, 0, 0.5)',
          fontWeight: 'bold',
        },
      },
      tooltip: {
        customContent(_, row) {
          const name = row[0]?.name;
          if (!name) return '?';
          const asset = assets.find(item => item.market_data.id === name);
          if (!asset) return '?';
          return `${asset.symbol?.name ?? ''}: ${formatNumber(
            asset.worth ?? 0,
            {
              compactInteger: true,
              decimalLength: 1,
              minifyDecimalRepeats: true,
              seperateByComma: true,
            },
          )} USDT`;
        },
        domStyles: {
          'g2-tooltip': {
            background: '#151619',
            color: '#fff',
            boxShadow: 'none',
            padding: '0.5rem',
            borderRadius: '0.25rem',
          },
        },
      },
      loading: whale.isLoading,
      smooth: true,
      autoFit: true,
      legend: false,
      className: 'rounded-lg overflow-hidden',
    };
  }, [whale]);

  return (
    <OverviewWidget
      className={clsx('min-h-[496px] mobile:min-h-[482px]', className)}
      loading={whale.isLoading}
      empty={!whale.data?.holder_address}
      title={t('whale_assets.title')}
    >
      <Treemap {...config} />
    </OverviewWidget>
  );
}
