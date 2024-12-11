import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OverviewWidget } from 'shared/OverviewWidget';

import { ButtonSelect } from 'shared/ButtonSelect';
import { useTechnicalRadarTopCoins } from 'api/market-pulse';
import { TechnicalCharts } from './TechnicalCharts';
import { TechnicalTable } from './TechnicalTable';

export function TechnicalOverviewWidget({ className }: { className?: string }) {
  const { t } = useTranslation('market-pulse');
  const [tab, setTab] = useState<'chart' | 'table'>('chart');
  const technicalTopCoins = useTechnicalRadarTopCoins();

  return (
    <OverviewWidget
      className={className}
      title={t('common.overview')}
      contentClassName="!min-h-[450px]"
      loading={technicalTopCoins.isLoading}
      empty={technicalTopCoins.data?.length === 0}
    >
      <div>
        <ButtonSelect
          className="mb-6 mobile:w-full"
          value={tab}
          onChange={setTab}
          options={[
            {
              label: t('common.chart_view'),
              value: 'chart',
            },
            {
              label: t('common.table_view'),
              value: 'table',
            },
          ]}
        />
      </div>

      {tab === 'chart' && <TechnicalCharts />}
      {tab === 'table' && <TechnicalTable />}
    </OverviewWidget>
  );
}
