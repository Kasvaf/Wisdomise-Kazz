import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecentCandlesQuery } from 'api';
import { type SupportedPair } from 'api/types/strategy';
import { useSignalerQuery, useMySignalerOpenPositions } from 'api/builder';
import ActivePosition from 'modules/signaler/ActivePosition';
import SimulatedPositionsChart from 'modules/signaler/SimulatedPositionsChart';
import Spinner from 'shared/Spinner';
import AssetSelector from '../../AssetSelector';
import SignalForm from './SignalForm';

const TabTerminal = () => {
  const { t } = useTranslation('strategy');
  const params = useParams<{ id: string }>();
  const { data: signaler } = useSignalerQuery(params.id);
  const [asset, setAsset] = useState<SupportedPair>();

  const { data: candles, isLoading: candlesLoading } = useRecentCandlesQuery(
    asset?.name,
  );

  const { data, isLoading } = useMySignalerOpenPositions(params.id);
  const openPositions = data?.map(p => ({
    ...p,
    suggested_action: p.signal?.action.toUpperCase() as
      | 'CLOSE'
      | 'OPEN'
      | undefined,
  }));
  const activePosition = openPositions?.find(x => x.pair_name === asset?.name);

  return (
    <div className="mt-8">
      <div className="mb-8 flex flex-col justify-start gap-4 border-b border-white/5 pb-8">
        <AssetSelector
          label="Crypto"
          placeholder="Select Crypto"
          assets={signaler?.assets}
          selectedItem={asset}
          onSelect={setAsset}
          className="w-[250px]"
          selectFirst
        />

        {!isLoading && asset && (
          <div className="mt-6">
            <h2 className="mb-3 text-xl text-white/40">
              {signaler?.name} {t('strategy:signaler.active-positions')}
            </h2>
            <ActivePosition position={activePosition} />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        !!asset &&
        !!signaler && (
          <div className="flex gap-4">
            <div className="basis-2/3 rounded-xl bg-black/20">
              <SimulatedPositionsChart
                candles={candles}
                loading={candlesLoading}
                positions={[]}
              />
            </div>

            <SignalForm
              signaler={signaler}
              assetName={asset.name}
              activePosition={activePosition}
            />
          </div>
        )
      )}
    </div>
  );
};

export default TabTerminal;
