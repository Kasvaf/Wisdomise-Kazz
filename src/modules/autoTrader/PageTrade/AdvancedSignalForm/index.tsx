import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { type Position } from 'api';
import { Button } from 'shared/v1-components/Button';
import PartIntro from './PartIntro';
import PartOpen from './PartOpen';
import PartTpSl from './PartTpSl';
import { type SignalFormState } from './useSignalFormStates';
import BtnFireSignal from './BtnFireSignal';

interface Props {
  isMinimal?: boolean;
  baseSlug: string;
  activePosition?: Position;
  formState: SignalFormState;
  className?: string;
}

const AdvancedSignalForm: React.FC<Props> = ({
  isMinimal,
  baseSlug,
  activePosition,
  formState,
  className,
}) => {
  const navigate = useNavigate();

  const {
    firing: [firing],
    confirming: [confirming],
  } = formState;

  const normSlug = baseSlug === 'solana' ? 'wrapped-solana' : baseSlug;

  return (
    <div className={clsx('flex flex-col gap-3', className)}>
      <div className="flex flex-col gap-5">
        <PartIntro
          data={formState}
          baseSlug={baseSlug}
          noManualPreset={isMinimal}
        />

        {!isMinimal && (
          <>
            <div className="id-line my-4 border-b border-white/5" />
            <PartOpen data={formState} baseSlug={baseSlug} />
            <PartTpSl type="TP" data={formState} baseSlug={baseSlug} />
            <PartTpSl type="SL" data={formState} baseSlug={baseSlug} />
          </>
        )}
      </div>

      {isMinimal ? (
        <div className="mt-3 flex items-center gap-2">
          <Button
            block
            variant="outline"
            disabled={confirming || firing}
            onClick={() => navigate(`/trader/bot/${normSlug ?? ''}`)}
          >
            Advanced Terminal
          </Button>

          <BtnFireSignal
            baseSlug={baseSlug}
            activePosition={activePosition}
            formState={formState}
            className="grow"
          />
        </div>
      ) : (
        <BtnFireSignal
          baseSlug={baseSlug}
          activePosition={activePosition}
          formState={formState}
        />
      )}
    </div>
  );
};

export default AdvancedSignalForm;
