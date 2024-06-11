import { type Candle } from 'api';
import { type SignalFormState } from '../AdvancedSignalForm/useSignalFormStates';
import useSignalerPriceLines from './useSignalerPriceLines';
import useChartContainer from './useChartContainer';
import useCandleSeries from './useCandleSeries';

const TradingViewChart: React.FC<{
  loading?: boolean;
  candles?: Candle[];
  formState: SignalFormState;
}> = ({ candles, formState }) => {
  const { chart, containerEl } = useChartContainer();
  const candleSeries = useCandleSeries({ chart, candles });

  useSignalerPriceLines({
    chart,
    candleSeries,
    formState,
  });

  return containerEl;
};

export default TradingViewChart;
