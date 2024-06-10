import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCandlesQuery } from 'api';
import { useSignalerQuery, useMySignalerAllPositions } from 'api/builder';
import { bestResolution } from 'shared/CandleChart/utils';
import useIsMobile from 'utils/useIsMobile';
import useSearchParamAsState from 'shared/useSearchParamAsState';
import ActivePosition from 'modules/insight/signaler/ActivePosition';
import SimulatedPositionsTable from 'modules/insight/signaler/SimulatedPositionsTable';
import SimulatedPositionsChart from 'modules/insight/signaler/SimulatedPositionsChart';
import DateRangeSelector from 'shared/DateRangeSelector';
import Spinner from 'shared/Spinner';
import AssetSelector from '../AssetSelector';

const TabPositions = () => {
  const { t } = useTranslation('builder');
  const params = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const { data: signaler } = useSignalerQuery(params.id);
  const [assetName, setAssetName] = useSearchParamAsState('asset');
  const [dateRange, setDateRange] = useState<[Date, Date]>();

  const { data, isLoading } = useMySignalerAllPositions({
    signalerKey: params.id,
    assetName,
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
  const activePosition = allPositions
    ?.filter(x => x.status === 'OPEN')
    .map(x => ({ ...x, strategy: signaler }));
  const simulatedPositions = allPositions?.filter(x => x.exit_time);

  const { data: candles, isLoading: candlesLoading } = useCandlesQuery({
    asset: assetName,
    resolution: bestResolution(dateRange),
    startDateTime: dateRange?.[0]?.toISOString(),
    endDateTime: dateRange?.[1]?.toISOString(),
    market: signaler?.market_name,
  });

  return (
    <div className="my-8">
      <div className="mb-8 flex justify-start gap-4 border-b border-white/5 pb-8 mobile:flex-col">
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

        <DateRangeSelector
          onChange={setDateRange}
          value={dateRange}
          label={t('common:date')}
          defaultRecent={7}
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
                    {t('strategy:signaler.simulated-position-history')}
                  </h2>
                  <SimulatedPositionsTable items={allPositions ?? []} />
                </div>
              )}

              {!isMobile && assetName && (
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
