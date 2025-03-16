/* eslint-disable import/max-dependencies */
import { useState } from 'react';
import RadarsTabs from 'modules/insight/RadarsTabs';
import { CoinPreDetailModal } from 'modules/insight/CoinPreDetailModal';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import { type TechnicalRadarCoin } from 'api';
import {
  type TechnicalRadarView,
  TechnicalRadarViewSelect,
} from '../TechnicalRadarViewSelect';
import { TechnicalRadarSentiment } from '../TechnicalRadarSentiment';
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
        coin={selectedRow?.symbol}
        categories={selectedRow?.symbol.categories}
        labels={selectedRow?.symbol_labels}
        marketData={selectedRow?.data}
        networks={selectedRow?.networks}
        security={selectedRow?.symbol_security?.data}
        open={modal}
        onClose={() => setModal(false)}
      >
        {selectedRow?.sparkline && (
          <CoinPriceChart value={selectedRow?.sparkline?.prices ?? []} />
        )}
        {selectedRow && (
          <TechnicalRadarSentiment
            value={selectedRow}
            mode="expanded"
            className="w-full"
          />
        )}
      </CoinPreDetailModal>
    </>
  );
};
