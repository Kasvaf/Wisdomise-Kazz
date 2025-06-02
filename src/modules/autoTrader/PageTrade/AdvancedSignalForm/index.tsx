import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { type Position } from 'api';
import { useCoinDetails } from 'api/discovery';
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

  const coin = useCoinDetails({ slug: baseSlug });
  const isNewBorn = coin?.data?.symbol_labels?.includes('new_born');
  return (
    <div className={clsx('flex flex-col gap-3', className)}>
      {isMinimal && isNewBorn ? (
        <div className="rounded-lg border border-v1-border-notice bg-v1-surface-l4 p-3 text-sm">
          AI Presets are not supported for Trench coins (newly launched tokens).
          Please use the Advanced Terminal to configure your trade manually.
        </div>
      ) : (
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
      )}

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
