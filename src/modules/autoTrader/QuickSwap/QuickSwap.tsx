import Spinner from 'shared/Spinner';
import { useTraderPositionQuery } from 'api';
import { type QuickSwapInputs } from './types';
import QuickSwapForm from './QuickSwapForm';

const QuickSwap = (inputs: QuickSwapInputs) => {
  const { positionKey, ...inputsRest } = inputs;
  const position = useTraderPositionQuery({ positionKey });

  return (
    <div>
      {positionKey && position.isLoading ? (
        <div className="my-8 flex justify-center">
          <Spinner />
        </div>
      ) : (
        (!positionKey || !!position.data) && (
          <QuickSwapForm
            {...inputsRest}
            activePosition={position.data}
            className="max-w-full basis-1/3"
          />
        )
      )}
    </div>
  );
};

export default QuickSwap;
