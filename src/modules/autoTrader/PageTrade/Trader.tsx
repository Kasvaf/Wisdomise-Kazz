import { useTraderPositionQuery } from 'api';
import Spinner from 'shared/Spinner';
import useSignalFormStates from './AdvancedSignalForm/useSignalFormStates';
import AdvancedSignalForm from './AdvancedSignalForm';
import { type TraderInputs } from './types';
import useSyncFormState from './AdvancedSignalForm/useSyncFormState';
import FiringHolder from './FiringHolder';

const Trader: React.FC<
  TraderInputs & {
    isMinimal?: boolean;
    loadingClassName?: string;
  }
> = inputs => {
  const { isMinimal, slug, positionKey, loadingClassName } = inputs;
  const position = useTraderPositionQuery({ positionKey });
  const formState = useSignalFormStates(inputs);
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
            isMinimal={isMinimal}
            baseSlug={slug}
            activePosition={position.data}
            className="max-w-full basis-1/3"
            formState={formState}
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
