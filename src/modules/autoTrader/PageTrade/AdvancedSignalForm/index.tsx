import { clsx } from 'clsx';
import { type Position } from 'api';
import useSyncFormState from './useSyncFormState';
import PartIntro from './PartIntro';
import PartOpen from './PartOpen';
import PartTpSl from './PartTpSl';
import { type SignalFormState } from './useSignalFormStates';
import BtnFireSignal from './BtnFireSignal';

interface Props {
  baseSlug: string;
  activePosition?: Position;
  formState: SignalFormState;
  className?: string;
}

const AdvancedSignalForm: React.FC<Props> = ({
  baseSlug,
  activePosition,
  formState,
  className,
}) => {
  useSyncFormState({
    formState,
    baseSlug,
    activePosition,
  });

  return (
    <div className={clsx('flex flex-col gap-3', className)}>
      <div className="flex flex-col gap-5">
        <PartIntro data={formState} baseSlug={baseSlug} />
        <div className="my-4 border-b border-white/5" />

        <PartOpen data={formState} baseSlug={baseSlug} />
        <PartTpSl type="TP" data={formState} baseSlug={baseSlug} />
        <PartTpSl type="SL" data={formState} baseSlug={baseSlug} />
      </div>

      <BtnFireSignal
        baseSlug={baseSlug}
        activePosition={activePosition}
        formState={formState}
      />
    </div>
  );
};

export default AdvancedSignalForm;
