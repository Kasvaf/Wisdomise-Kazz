import { type Candle } from 'api';
import { type SignalFormState } from '../AdvancedSignalForm/useSignalFormStates';
import useSignalerPriceLines from './useSignalerPriceLines';
import useChartContainer from './useChartContainer';
import useCandleSeries from './useCandleSeries';

const TradingViewChart: React.FC<{
  loading?: boolean;
  candles?: Candle[];
  formState: SignalFormState;
  marketPrice?: number;
}> = ({ candles, formState, marketPrice }) => {
  const { chart, containerEl } = useChartContainer();
  const candleSeries = useCandleSeries({ chart, candles });

  useSignalerPriceLines({
    chart,
    candleSeries,
    formState,
    marketPrice,
  });

  return containerEl;
};

export default TradingViewChart;
