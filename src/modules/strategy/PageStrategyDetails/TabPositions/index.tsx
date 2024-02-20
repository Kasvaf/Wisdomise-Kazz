import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { DatePicker } from 'antd';
import {
  type Asset,
  useCandlesQuery,
  useStrategyQuery,
  useStrategyPositionsQuery,
} from 'api';
import { bestResolution } from 'shared/CandleChart/utils';
import CandleChart from 'shared/CandleChart';
import Spinner from 'shared/Spinner';
import SpiSelector from './SpiSelector';
import AssetSelector from './AssetSelector';
import PositionsTable from './PositionsTable';

const { RangePicker } = DatePicker;

const TabPositions = () => {
  const params = useParams<{ id: string }>();
  const { data: strategy } = useStrategyQuery(params.id);

  const [asset, setAsset] = useState<Asset>();
  const [dateRange, setDateRange] = useState<[Date, Date]>();
  const rangeSelectHandler = (
    val?: Array<{
      $D: number;
      $M: number;
      $y: number;
    }> | null,
  ) => {
    if (val?.[0] && val[1]) {
      const [start, end] = val;
      setDateRange([
        new Date(start.$y, start.$M, start.$D, 0, 0, 0, 0),
        new Date(end.$y, end.$M, end.$D, 23, 59, 59, 999),
      ]);
    } else {
      setDateRange(undefined);
    }
  };

  const resolution = bestResolution(dateRange);

  const { data: candles, isLoading: candlesLoading } = useCandlesQuery({
    asset: asset?.symbol,
    resolution,
    startDateTime: dateRange?.[0].toISOString(),
    endDateTime: dateRange?.[1].toISOString(),
  });
  const candlesEnabled = Boolean(asset?.symbol && dateRange?.[0]);

  const [spi, setSpi] = useState('');
  const { data: positions, isLoading: positionsLoading } =
    useStrategyPositionsQuery({
      strategyKey: params.id,
      spiKey: spi,
      asset: asset?.symbol,
    });
  const positionsEnabled = Boolean(spi);
  const positionsInRange = positions?.filter(
    ({ actual_position: ap }) =>
      !dateRange ||
      ((!ap.exit_time || new Date(ap.exit_time) >= dateRange[0]) &&
        new Date(ap.entry_time) <= dateRange[1]),
  );

  return (
    <div>
      <div className="mb-8 flex justify-center gap-4 border-b border-white/20 pb-4">
        <AssetSelector
          assets={strategy?.assets.map(x => x.asset)}
          selectedItem={asset}
          onSelect={setAsset}
          all
        />

        <RangePicker onChange={rangeSelectHandler as any} />

        <SpiSelector
          strategyKey={params.id}
          onSelect={setSpi}
          selectedItem={spi}
        />
      </div>

      {(candlesLoading && candlesEnabled) ||
      (positionsEnabled && positionsLoading) ? (
        <div className="mt-12 flex justify-center">
          <Spinner />
        </div>
      ) : (
        candles && (
          <section className="mb-6 rounded-xl bg-black/20">
            <CandleChart
              candles={candles}
              positions={positions}
              resolution={resolution}
            />
          </section>
        )
      )}

      {positionsInRange && positionsEnabled && !positionsLoading && (
        <PositionsTable positions={positionsInRange} />
      )}
    </div>
  );
};

export default TabPositions;
