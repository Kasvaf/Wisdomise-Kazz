import { clsx } from 'clsx';
import { TraderPresetsSettings } from 'modules/autoTrader/BuySellTrader/TraderPresets';
import { useNavigate } from 'react-router-dom';
import { WRAPPED_SOLANA_SLUG } from 'services/chains/constants';
import type { Position } from 'services/rest';
import { useTokenReview } from 'services/rest/discovery';
import { Button } from 'shared/v1-components/Button';
import BtnFireSignal from './BtnFireSignal';
import PartIntro from './PartIntro';
import PartOpen from './PartOpen';
import PartTpSl from './PartTpSl';
import type { SignalFormState } from './useSignalFormStates';

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

  const normSlug = baseSlug === 'solana' ? WRAPPED_SOLANA_SLUG : baseSlug;

  const coin = useTokenReview({ slug: baseSlug });
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
            baseSlug={baseSlug}
            data={formState}
            noManualPreset={isMinimal}
          />

          {!isMinimal && (
            <>
              <div className="id-line my-4 border-white/5 border-b" />
              <PartOpen baseSlug={baseSlug} data={formState} />
              <PartTpSl baseSlug={baseSlug} data={formState} type="TP" />
              <PartTpSl baseSlug={baseSlug} data={formState} type="SL" />
            </>
          )}
        </div>
      )}

      <TraderPresetsSettings />

      {isMinimal ? (
        <div className="mt-3 flex items-center gap-2">
          <Button
            block
            disabled={confirming || firing}
            onClick={() => navigate(`/trader/bot/${normSlug ?? ''}`)}
            variant="outline"
          >
            Advanced Terminal
          </Button>

          <BtnFireSignal
            activePosition={activePosition}
            baseSlug={baseSlug}
            className="grow"
            formState={formState}
          />
        </div>
      ) : (
        <BtnFireSignal
          activePosition={activePosition}
          baseSlug={baseSlug}
          formState={formState}
        />
      )}
    </div>
  );
};

export default AdvancedSignalForm;
