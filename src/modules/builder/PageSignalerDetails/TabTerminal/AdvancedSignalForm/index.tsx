import { clsx } from 'clsx';
import { useEffect } from 'react';
import { type FullPosition, type SignalerData } from 'api/builder';
import PartOpen from './PartOpen';
import useSignalFormStates from './useSignalFormStates';
import PartTpSl from './PartTpSl';

interface Props {
  signaler: SignalerData;
  assetName: string;
  activePosition?: FullPosition;
  className?: string;
}

const AdvancedSignalForm: React.FC<Props> = ({
  signaler,
  assetName,
  activePosition,
  className,
}) => {
  const formState = useSignalFormStates();

  useEffect(() => {
    if (activePosition) {
      // formState.hasOpen[1](activePosition.)
    }
  }, [activePosition]);

  return (
    <div className={clsx('flex flex-col gap-3 px-3', className)}>
      <PartOpen data={formState} signaler={signaler} assetName={assetName} />
      <PartTpSl
        type="TP"
        data={formState}
        signaler={signaler}
        assetName={assetName}
      />
      <PartTpSl
        type="SL"
        data={formState}
        signaler={signaler}
        assetName={assetName}
      />
    </div>
  );
};

export default AdvancedSignalForm;
