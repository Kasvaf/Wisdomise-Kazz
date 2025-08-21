import { Treemap } from '@ant-design/plots';
import type { TreemapConfig } from '@ant-design/plots/es/components/treemap';
import { useWhaleDetails } from 'api/discovery';
import { clsx } from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatNumber } from 'utils/numbers';

export function WhaleAssetsTreeMapWidget({
  className,
  holderAddress,
  networkName,
  hr,
}: {
  className?: string;
  holderAddress: string;
  networkName: string;
  hr?: boolean;
}) {
  const { t } = useTranslation('whale');
  const whale = useWhaleDetails({
    holderAddress,
    networkName,
  });

  const config = useMemo<TreemapConfig>(() => {
    const allAssets = [...(whale.data?.assets ?? [])].filter(
      (row, index, self) =>
        row.market_data.id &&
        (row.worth ?? 0) > 0 &&
        self.findIndex(
          subRow => subRow.market_data.id === row.market_data.id,
        ) === index,
    );

    const totalWorth = allAssets.reduce((p, c) => p + (c.worth ?? 0), 0);

    let otherAssets: Array<(typeof allAssets)[number]> = [];

    let data: Array<{
      name: string;
      label: string;
      tooltip: string;
      color: string;
      value: number;
    }> = [];

    for (const asset of allAssets) {
      const percentage = ((asset.worth ?? 0) / totalWorth) * 100;
      if (percentage < 0.01) {
        otherAssets = [...otherAssets, asset];
      } else {
        data = [
          ...data,
          {
            color:
              (asset.market_data.price_change_percentage_24h ?? 0) >= 0
                ? '#66FFC8'
                : '#F78C9A',
            label: `${asset.symbol?.abbreviation ?? '---'}\n$${formatNumber(
              asset.worth ?? 0,
              {
                compactInteger: true,
                decimalLength: 1,
                minifyDecimalRepeats: true,
                separateByComma: true,
              },
            )}`,
            name: asset.market_data.id,
            value: Math.log2((asset.worth ?? 0) + 1),
            tooltip: `${asset.symbol?.name ?? ''}: $${formatNumber(
              asset.worth ?? 0,
              {
                compactInteger: true,
                decimalLength: 1,
                minifyDecimalRepeats: true,
                separateByComma: true,
              },
            )}`,
          },
        ];
      }
    }

    if (otherAssets.length > 0) {
      data = [
        ...data,
        {
          name: 'others...',
          color: 'gray',
          label: `${t('whale_assets.others')}\n$${formatNumber(
            otherAssets.reduce((p, c) => p + (c.worth ?? 0), 0),
            {
              compactInteger: true,
              decimalLength: 1,
              minifyDecimalRepeats: true,
              separateByComma: true,
            },
          )}`,
          value: Math.log2(otherAssets.reduce((p, c) => p + (c.worth ?? 0), 1)),
          tooltip: otherAssets
            .map(
              asset =>
                `${asset.symbol?.name ?? ''}: $${formatNumber(
                  asset.worth ?? 0,
                  {
                    compactInteger: true,
                    decimalLength: 1,
                    minifyDecimalRepeats: true,
                    separateByComma: true,
                  },
                )}`,
            )
            .join('<br>'),
        },
      ];
    }
    return {
      data: {
        name: 'root',
        children: data,
      },
      supportCSSTransform: true,
      rectStyle: row => {
        const item = data.find(r => r.name === row?.name);
        if (!item) return {};
        return {
          fill: item.color,
          stroke: '#1e1f24',
          lineWidth: 1.5,
        };
      },
      label: {
        autoRotate: true,
        content: row => {
          const item = data.find(r => r.name === row?.name);
          if (!item) return '?';
          return item.label;
        },
        style: {
          fill: 'rgba(0, 0, 0, 0.5)',
          fontWeight: 'bold',
        },
      },
      tooltip: {
        customContent(_, row) {
          const item = data.find(r => r.name === row[0]?.name);
          if (!item) return '?';
          return item.tooltip;
        },
        domStyles: {
          'g2-tooltip': {
            background: '#151619',
            color: '#fff',
            boxShadow: 'none',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            lineHeight: 1.3,
          },
        },
      },
      loading: whale.isLoading,
      smooth: true,
      autoFit: true,
      legend: false,
      className: 'scale-[1.01]',
      renderer: 'svg',
    };
  }, [whale, t]);

  if (whale.isLoading || !whale.data?.holder_address) return null;

  return (
    <>
      <div className={clsx(className)}>
        <h3 className="mb-4 font-semibold text-sm">
          {t('whale_assets.title')}
        </h3>
        <div
          className="h-[350px] overflow-hidden rounded-lg"
          id="whale-treemap"
        >
          <Treemap {...config} />
        </div>
      </div>
      {hr && <hr className="border-white/10" />}
    </>
  );
}
