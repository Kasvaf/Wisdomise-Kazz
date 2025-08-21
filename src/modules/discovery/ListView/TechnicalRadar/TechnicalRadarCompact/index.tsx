import type { TechnicalRadarCoin } from 'api/discovery';
import type { FC } from 'react';
import { CoinPriceChart } from 'shared/CoinPriceChart';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import {
  CoinPreDetailModal,
  useCoinPreDetailModal,
} from '../../CoinPreDetailModal';
import { TechnicalRadarSentiment } from '../TechnicalRadarSentiment';
import TechnicalRadarSharingModal from '../TechnicalRadarSharingModal';
import {
  type TechnicalRadarView,
  TechnicalRadarViewSelect,
} from '../TechnicalRadarViewSelect';
import { TechnicalRadarCoinsCharts } from './TechnicalRadarCoinsCharts';
import { TechnicalRadarCoinsTable } from './TechnicalRadarCoinsTable';

export const TechnicalRadarCompact: FC<{ focus?: boolean }> = ({ focus }) => {
  const [tab, setTab] = useSearchParamAsState<TechnicalRadarView>(
    'technical-radar-tab',
    'table',
  );

  const [openModal, { closeModal, isModalOpen, selectedRow }] =
    useCoinPreDetailModal<TechnicalRadarCoin>({
      directNavigate: !focus,
      slug: r => r.symbol.slug,
    });

  return (
    <div className="p-3">
      <TechnicalRadarViewSelect
        className="mb-4 w-full"
        onChange={setTab}
        size="sm"
        surface={1}
        value={tab}
      />
      {tab === 'chart' && (
        <TechnicalRadarCoinsCharts onClick={row => openModal(row)} />
      )}
      {tab === 'table' && (
        <TechnicalRadarCoinsTable onClick={row => openModal(row)} />
      )}
      <CoinPreDetailModal
        categories={selectedRow?.symbol.categories}
        coin={selectedRow?.symbol}
        hasShare={true}
        labels={selectedRow?.symbol_labels}
        marketData={selectedRow?.data}
        networks={selectedRow?.networks}
        onClose={() => closeModal()}
        open={isModalOpen}
        security={selectedRow?.symbol_security?.data}
      >
        {selectedRow?.sparkline && (
          <CoinPriceChart value={selectedRow?.sparkline?.prices ?? []} />
        )}
        {selectedRow && (
          <TechnicalRadarSentiment
            className="w-full"
            mode="expanded"
            value={selectedRow}
          />
        )}
        {selectedRow && (
          <TechnicalRadarSharingModal coin={selectedRow} open={false} />
        )}
      </CoinPreDetailModal>
    </div>
  );
};
