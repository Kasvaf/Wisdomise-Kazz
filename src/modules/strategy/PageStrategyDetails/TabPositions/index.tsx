import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { DatePicker } from 'antd';
import {
  type Asset,
  useCandlesQuery,
  useStrategyQuery,
  useStrategyPositionsQuery,
} from 'api';
import Spinner from 'modules/shared/Spinner';
import CandleChart from './CandleChart';
import AssetSelector from './AssetSelector';
import SpiSelector from './SpiSelector';

const { RangePicker } = DatePicker;

const TabPositions = () => {
  const params = useParams<{ id: string }>();
  const { data: strategy } = useStrategyQuery(params.id);

  const [asset, setAsset] = useState<Asset>();
  const [dateRange, setDateRange] = useState<[Date, Date]>();
  const rangeSelectHandler = ([start, end]: Array<{
    $D: number;
    $M: number;
    $y: number;
  }> = []) => {
    if (start && end) {
      setDateRange([
        new Date(start.$y, start.$M, start.$D, 0, 0, 0, 0),
        new Date(end.$y, end.$M, end.$D, 23, 59, 59, 9999),
      ]);
    }
  };

  const { data: candles, isLoading: candlesLoading } = useCandlesQuery({
    asset: asset?.symbol,
    resolution: '1h',
    startDateTime: dateRange?.[0].toISOString(),
    endDateTime: dateRange?.[1].toISOString(),
  });

  const [spi, setSpi] = useState('');
  const { data: positions } = useStrategyPositionsQuery({
    strategyKey: params.id,
    spiKey: spi,
  });

  return (
    <div>
      <div className="mb-8 flex justify-center gap-4 border-b border-white/20 pb-4">
        <AssetSelector
          assets={strategy?.assets.map(x => x.asset)}
          selectedItem={asset}
          onSelect={setAsset}
        />

        <RangePicker onChange={rangeSelectHandler as any} />

        <SpiSelector
          strategyKey={params.id}
          onSelect={setSpi}
          selectedItem={spi}
        />
      </div>

      {candlesLoading && asset ? (
        <div className="mt-12 flex justify-center">
          <Spinner />
        </div>
      ) : (
        candles && <CandleChart candles={candles} positions={positions} />
      )}
    </div>
  );
};

export default TabPositions;
