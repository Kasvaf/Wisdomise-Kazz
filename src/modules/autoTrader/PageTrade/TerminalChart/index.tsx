import { useState } from 'react';
import AdvancedChart from 'shared/AdvancedChart';
import { type IChartingLibraryWidget } from 'shared/AdvancedChart/charting_library';
import { type SignalFormState } from '../AdvancedSignalForm/useSignalFormStates';
import useSyncLines from './useSyncLines';

const TerminalChart: React.FC<{
  assetName: string;
  formState: SignalFormState;
  marketPrice?: number;
  className?: string;
}> = ({ assetName, formState, marketPrice, className }) => {
  const [widget, setWidget] = useState<IChartingLibraryWidget>();

  useSyncLines({
    widget,
    formState,
    marketPrice,
  });

  return (
    <AdvancedChart
      slug={assetName}
      widgetRef={setWidget}
      className={className}
    />
  );
};

export default TerminalChart;
