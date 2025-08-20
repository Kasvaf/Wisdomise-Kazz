import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useState,
} from 'react';
import type { IChartingLibraryWidget } from 'shared/AdvancedChart/charting_library';

type OptionalChart = IChartingLibraryWidget | undefined;
const ChartContext = createContext<
  [OptionalChart, Dispatch<SetStateAction<OptionalChart>>] | undefined
>(undefined);

export const ChartWidgetProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const chartState = useState<OptionalChart>();
  return (
    <ChartContext.Provider value={chartState}>{children}</ChartContext.Provider>
  );
};

export const useAdvancedChartWidget = () => {
  const chartWidget = useContext(ChartContext);
  if (!chartWidget) {
    throw new Error('useAdvancedChartWidget must be inside provider');
  }
  return chartWidget;
};
