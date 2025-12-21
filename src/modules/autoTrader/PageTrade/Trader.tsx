import { useTraderPositionQuery } from 'services/rest';
import Spinner from 'shared/Spinner';
import AdvancedSignalForm from './AdvancedSignalForm';
import useSignalFormStates from './AdvancedSignalForm/useSignalFormStates';
import useSyncChartLines from './AdvancedSignalForm/useSyncChartLines';
import useSyncFormState from './AdvancedSignalForm/useSyncFormState';
import FiringHolder from './FiringHolder';
import type { TraderInputs } from './types';

const Trader: React.FC<
  TraderInputs & {
    isMinimal?: boolean;
    loadingClassName?: string;
  }
> = inputs => {
  const { isMinimal, slug, positionKey, loadingClassName } = inputs;
  const position = useTraderPositionQuery({ positionKey });
  const formState = useSignalFormStates(inputs);
  useSyncChartLines({ formState });
  useSyncFormState({
    formState,
    baseSlug: slug,
    activePosition: position.data,
  });

  const {
    confirming: [confirming],
    firing: [firing],
  } = formState;

  return (
    <div>
      {positionKey && position.isLoading ? (
        <div className="my-8 flex justify-center">
          <Spinner />
        </div>
      ) : (
        (!positionKey || !!position.data) && (
          <AdvancedSignalForm
            activePosition={position.data}
            baseSlug={slug}
            className="max-w-full basis-1/3"
            formState={formState}
            isMinimal={isMinimal}
          />
        )
      )}

      {(confirming || firing) && (
        <FiringHolder className={loadingClassName} firing={firing} />
      )}
    </div>
  );
};

export default Trader;
