import { clsx } from 'clsx';
import { Spin } from 'antd';
import { useTraderPositionQuery } from 'api';
import Spinner from 'shared/Spinner';
import useSignalFormStates from './AdvancedSignalForm/useSignalFormStates';
import AdvancedSignalForm from './AdvancedSignalForm';
import { type TraderInputs } from './types';

export default function Trader(
  inputs: TraderInputs & { loadingClassName?: string },
) {
  const { slug, positionKey, loadingClassName } = inputs;
  const position = useTraderPositionQuery({ positionKey });
  const formState = useSignalFormStates(inputs);
  const {
    confirming: [confirming],
    firing: [firing],
  } = formState;

  return (
    <div className="relative">
      {positionKey && position.isLoading ? (
        <div className="my-8 flex justify-center">
          <Spinner />
        </div>
      ) : (
        (!positionKey || !!position.data) && (
          <AdvancedSignalForm
            baseSlug={slug}
            activePosition={position.data}
            className="max-w-full basis-1/3"
            formState={formState}
          />
        )
      )}

      {(confirming || firing) && (
        <div
          className={clsx(
            'flex items-center justify-center gap-2 text-sm',
            'absolute inset-0 rounded-sm',
            loadingClassName,
          )}
        >
          <Spin size="small" />
          {firing
            ? 'Creating the trading plan...'
            : 'Confirming transaction on network...'}
        </div>
      )}
    </div>
  );
}
