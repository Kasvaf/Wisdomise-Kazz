/* eslint-disable import/max-dependencies */
import { useState } from 'react';
import { MobileSearchBar } from 'shared/MobileSearchBar';
import RadarsTabs from 'modules/insight/RadarsTabs';
import { CoinPreDetailModal } from 'modules/insight/CoinPreDetailModal';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { type TechnicalRadarCoin } from 'api';
import {
  type TechnicalRadarView,
  TechnicalRadarViewSelect,
} from '../TechnicalRadarViewSelect';
import { TechnicalSentiment } from '../TechnicalSentiment';
import { TechnicalRadarCoinsTable } from './TechnicalRadarCoinsTable';
import { TechnicalRadarCoinsCharts } from './TechnicalRadarCoinsCharts';

export const TechnicalRadarMobile = () => {
  const [tab, setTab] = useSearchParamAsState<TechnicalRadarView>(
    'overviewTab',
    'table',
  );

  const [selectedRow, setSelectedRow] = useState<null | TechnicalRadarCoin>(
    null,
  );
  const [modal, setModal] = useState(false);

  return (
    <>
      <MobileSearchBar className="mb-4" />
      <RadarsTabs className="mb-4" />
      <TechnicalRadarViewSelect
        className="mb-4 w-full"
        value={tab}
        onChange={setTab}
        size="sm"
        surface={1}
      />
      {tab === 'chart' && (
        <TechnicalRadarCoinsCharts
          onClick={row => {
            setSelectedRow(row);
            setModal(true);
          }}
        />
      )}
      {tab === 'table' && (
        <TechnicalRadarCoinsTable
          onClick={row => {
            setSelectedRow(row);
            setModal(true);
          }}
        />
      )}
      <CoinPreDetailModal
        slug={selectedRow?.symbol.slug}
        open={modal}
        onClose={() => setModal(false)}
      >
        {selectedRow?.sparkline && (
          <CoinPriceChart value={selectedRow?.sparkline?.prices ?? []} />
        )}
        {selectedRow && (
          <TechnicalSentiment value={selectedRow} mode="expanded" />
        )}
      </CoinPreDetailModal>
    </>
  );
};
