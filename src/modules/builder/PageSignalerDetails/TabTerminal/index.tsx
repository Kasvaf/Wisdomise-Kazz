import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useIsSamePairs, useRecentCandlesQuery } from 'api';
import { useSignalerQuery, useMySignalerOpenPositions } from 'api/builder';
import SimulatedPositionsChart from 'modules/insight/signaler/SimulatedPositionsChart';
import ActivePosition from 'modules/insight/signaler/ActivePosition';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import Spinner from 'shared/Spinner';
import AssetSelector from '../../AssetSelector';
import SignalForm from './SignalForm';

const TabTerminal = () => {
  const { t } = useTranslation('strategy');
  const params = useParams<{ id: string }>();
  const { data: signaler } = useSignalerQuery(params.id);
  const [assetName, setAssetName] = useSearchParamAsState('asset');
  const isSamePairs = useIsSamePairs();

  const { data: candles, isLoading: candlesLoading } = useRecentCandlesQuery(
    assetName,
    signaler?.market_name,
  );

  const { data, isLoading } = useMySignalerOpenPositions(params.id);
  const openPositions = data?.map(p => ({
    ...p,
    suggested_action: p.signal?.action.toUpperCase() as
      | 'CLOSE'
      | 'OPEN'
      | undefined,
  }));
  const activePosition = openPositions?.find(x =>
    isSamePairs(x.pair_name, assetName),
  );

  return (
    <div className="mt-8">
      <div className="mb-8 flex flex-col justify-start gap-4 border-b border-white/5 pb-8">
        <AssetSelector
          label={t('common:crypto')}
          placeholder={t('common:select-crypto')}
          assets={signaler?.assets.map(x => x.name)}
          selectedItem={assetName}
          onSelect={setAssetName}
          className="w-[250px] mobile:w-full"
          selectFirst
          market={signaler?.market_name}
        />

        {!isLoading && assetName && (
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
        !!assetName &&
        !!signaler && (
          <div className="flex gap-4 mobile:flex-col-reverse">
            <div className="basis-2/3">
              <SimulatedPositionsChart
                candles={candles}
                loading={candlesLoading}
                positions={[]}
              />
            </div>

            <SignalForm
              signaler={signaler}
              assetName={assetName}
              activePosition={activePosition}
            />
          </div>
        )
      )}
    </div>
  );
};

export default TabTerminal;
