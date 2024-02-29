import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCandlesQuery } from 'api';
import { type PairData } from 'api/types/strategy';
import { useSignalerQuery, useMySignalerAllPositions } from 'api/builder';
import useIsMobile from 'utils/useIsMobile';
import { bestResolution } from 'shared/CandleChart/utils';
import DateRangeSelector from 'shared/DateRangeSelector';
import Spinner from 'shared/Spinner';
import ActivePosition from 'modules/signaler/ActivePosition';
import SimulatedPositionsTable from 'modules/signaler/SimulatedPositionsTable';
import SimulatedPositionsChart from 'modules/signaler/SimulatedPositionsChart';
import AssetSelector from '../AssetSelector';

const TabPositions = () => {
  const { t } = useTranslation('strategy');
  const isMobile = useIsMobile();
  const params = useParams<{ id: string }>();
  const { data: signaler } = useSignalerQuery(params.id);
  const [asset, setAsset] = useState<PairData>();
  const [dateRange, setDateRange] = useState<[Date, Date]>();

  const { data, isLoading } = useMySignalerAllPositions({
    signalerKey: params.id,
    assetName: asset?.name,
    startTime: dateRange?.[0]?.toISOString(),
    endTime: dateRange?.[1]?.toISOString(),
  });

  const inputted = Boolean(params.id && dateRange?.[0] && dateRange?.[1]);

  const allPositions = data?.map(p => ({
    ...p,
    suggested_action: p.signal?.action.toUpperCase() as
      | 'CLOSE'
      | 'OPEN'
      | undefined,
  }));
  const activePosition = allPositions?.filter(x => !x.exit_time);
  const simulatedPositions = allPositions?.filter(x => x.exit_time);

  const { data: candles, isLoading: candlesLoading } = useCandlesQuery({
    asset: asset?.name,
    resolution: bestResolution(dateRange),
    startDateTime: dateRange?.[0]?.toISOString(),
    endDateTime: dateRange?.[1]?.toISOString(),
  });

  return (
    <div className="my-8">
      <div className="mb-8 flex justify-start gap-4 border-b border-white/5 pb-8 mobile:flex-col">
        <AssetSelector
          label="Crypto"
          placeholder="Select Crypto"
          assets={signaler?.assets}
          selectedItem={asset}
          onSelect={setAsset}
          className="w-[250px] mobile:w-full"
          selectFirst
        />

        <DateRangeSelector
          onChange={setDateRange}
          value={dateRange}
          label="Date"
          defaultRecent={3}
        />
      </div>

      {inputted && (
        <>
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="mt-10">
                <h2 className="mb-3 text-xl text-white/40">
                  {signaler?.name} {t('strategy:signaler.active-positions')}
                </h2>
                {activePosition?.length ? (
                  activePosition.map(pos => (
                    <ActivePosition key={pos.entry_time} position={pos} />
                  ))
                ) : (
                  <ActivePosition />
                )}
              </div>

              {!!simulatedPositions && (
                <div className="mt-10">
                  <h2 className="mb-3 text-xl text-white/40">
                    {t('signaler.simulated-position-history')}
                  </h2>
                  <SimulatedPositionsTable items={allPositions ?? []} />
                </div>
              )}

              {!isMobile && asset && (
                <SimulatedPositionsChart
                  candles={candles}
                  loading={candlesLoading}
                  positions={allPositions ?? []}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TabPositions;
