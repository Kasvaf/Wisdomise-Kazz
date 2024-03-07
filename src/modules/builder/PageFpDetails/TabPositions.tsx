import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCandlesQuery } from 'api';
import { type PairData } from 'api/types/strategy';
import { useFpPositionsQuery, useMyFinancialProductQuery } from 'api/builder';
import useIsMobile from 'utils/useIsMobile';
import { bestResolution } from 'shared/CandleChart/utils';
import DateRangeSelector from 'shared/DateRangeSelector';
import CandleChart from 'shared/CandleChart';
import Spinner from 'shared/Spinner';
import AssetSelector from '../AssetSelector';
import PositionsTable from './ActualPositionsTable';
import SubscriberSelector from './SubscriberSelector';

const TabPositions = () => {
  const { t } = useTranslation('strategy');
  const isMobile = useIsMobile();
  const params = useParams<{ id: string }>();
  const { data: fp } = useMyFinancialProductQuery(params.id);
  const [asset, setAsset] = useState<PairData>();
  const [dateRange, setDateRange] = useState<[Date, Date]>();
  const [subscriberKey, setSubscriberKey] = useState('');

  const { data: positionsDiff, isLoading } = useFpPositionsQuery({
    fpKey: params.id,
    subscriberKey,
    assetName: asset?.name,
    startTime: dateRange?.[0]?.toISOString(),
    endTime: dateRange?.[1]?.toISOString(),
  });

  const inputted = Boolean(
    params.id && asset?.name && dateRange?.[0] && dateRange?.[1],
  );

  const { data: candles, isLoading: candlesLoading } = useCandlesQuery({
    asset: asset?.name,
    resolution: bestResolution(dateRange),
    startDateTime: dateRange?.[0]?.toISOString(),
    endDateTime: dateRange?.[1]?.toISOString(),
  });

  return (
    <div className="mt-8">
      <div className="mb-8 flex justify-start gap-4 border-b border-white/5 pb-8 mobile:flex-col">
        <AssetSelector
          label="Crypto"
          placeholder="Select Crypto"
          assets={fp?.assets?.map(x => x.asset)}
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

        <SubscriberSelector
          label="Subscriber"
          className="w-[250px] mobile:w-full"
          fpKey={params.id}
          selectedItem={subscriberKey}
          onSelect={setSubscriberKey}
        />
      </div>

      {inputted && subscriberKey && (
        <>
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              {!!positionsDiff && (
                <div className="mt-10">
                  <h2 className="mb-3 text-xl text-white/40">
                    {t('signaler.simulated-position-history')}
                  </h2>
                  <PositionsTable positions={positionsDiff} />
                </div>
              )}

              {!isMobile && asset && candles && !candlesLoading && (
                <>
                  <CandleChart
                    candles={candles}
                    positions={positionsDiff}
                    resolution={bestResolution(dateRange)}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TabPositions;
